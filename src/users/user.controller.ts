import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req: Request) {
    console.log(req.user);
    return await this.userService.checkout(req.user, 'BASIC');
  }
}
