import { Injectable } from '@nestjs/common';

import { AuthProvider, JwtPayload } from '../shared';
import { Profile } from 'passport-github';
import { Plan, User } from '@prisma/client';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { productToPriceMap } from '../config/constants';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async findOrCreate(
    user_details: Profile,
    provider: AuthProvider,
    access_token: string,
  ): Promise<User> {
    const { username, emails, id, displayName } = user_details;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        external_id: id,
        provider_name: provider,
      },
    });
    let user = existingUser;
    if (!existingUser) {
      user = await this.prisma.user.create({
        data: {
          name: username ? username : displayName,
          email: emails ? emails[0].value : null,
          external_id: id,
          access_token,
          provider_name: provider,
        },
      });
    }
    if (!user.stripe_customer_id) {
      const stripeCustomer = await this.stripeService.createCustomer(user);
      const stripe_customer_id = stripeCustomer.id;
      user = await this.prisma.user.update({
        where: {
          external_id: id,
        },
        data: {
          stripe_customer_id,
        },
      });
    }
    return user;
  }

  async checkout(u: any, product: string): Promise<Stripe.Checkout.Session> {
    const { payload: user }: { payload: JwtPayload } = u;
    const customer = await this.stripeService.getCustomerById(
      user.stripe_customer_id,
    );

    console.log(customer);
    const price = productToPriceMap[product.toUpperCase()];
    const session = await this.stripeService.createCheckoutSession(
      customer.id,
      price,
    );

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.sub,
      },
      data: {
        plan: product.toUpperCase() as Plan,
      },
    });

    return session;
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  }

  async getUserByStripeId(stripe_id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        stripe_customer_id: stripe_id,
      },
    });
    return user;
  }

  async updateUserPackage(id: string, plan: Plan) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        plan,
      },
    });

    await this.prisma.subscription.create({
      data: {
        user_id: id,
        downloadsRemaining: 10,
      },
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async getUserByExternalId(external_id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        external_id,
      },
    });
    return user;
  }
}
