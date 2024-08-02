import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('success/:id')
  success() {
    return 'Subscription Bought Successfully';
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    //@ts-ignore
    //@ts-ignore
    return this.appService.getUser(req.user.payload.sub);
  }

  @Post('webhook')
  webhook(@Req() req) {
    return this.appService.webhook(req);
  }
}
