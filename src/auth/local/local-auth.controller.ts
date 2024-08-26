import { Controller, Post, UseGuards, Body, Res, Req } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthService } from './local-auth.service';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

@Controller('auth/local')
export class LocalAuthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private localAuthService: LocalAuthService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('hello');
    const user = req.user as User;
    const { accessToken } = this.jwtAuthService.login(user);
    res.cookie('jwt', accessToken);
    return { accessToken };
  }

  @Post('signup')
  async signIn(@Body() createUserDto: CreateUserDto) {
    return this.localAuthService.createUser(createUserDto);
  }
}
