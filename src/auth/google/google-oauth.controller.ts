import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthService } from '../jwt/jwt-auth.service';
import { GoogleOauthGuard } from './google-oauth.guard';
import { User } from '@prisma/client';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as User;

    const { accessToken } = this.jwtAuthService.login(user);
    console.log(`Generated Access Token: ${accessToken}`); // Debugging line
    res.cookie('jwt', accessToken);

    const redirectUrl = `http://localhost:3001/auth/google/callback?token=${accessToken}`;
    console.log(`Redirecting to: ${redirectUrl}`); // Debugging line
    res.redirect(redirectUrl);
  }
}
