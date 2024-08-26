import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { StripeService } from 'src/shared/stripe/stripe.service';

@Injectable()
export class LocalAuthService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async createUser(createUserDto: CreateUserDto) {
    let existing_user = await this.prisma.user.findUnique({
      where: {
        email_provider_name: {
          email: createUserDto.email,
          provider_name: 'local',
        },
      },
    });

    if (existing_user) {
      return new BadRequestException('user already exist');
    }

    existing_user = await this.prisma.user.findUnique({
      where: {
        provider_name: 'local',
        username: createUserDto.username,
      },
    });

    if (existing_user) {
      return new BadRequestException('user already exist');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    let user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        provider_name: 'local',
      },
    });
    const stripe_customer = await this.stripeService.createCustomer(user);
    user = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripe_customer_id: stripe_customer.id,
      },
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
