import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../../shared';
import { User } from '@prisma/client';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User) {
    const { id, name, external_id, stripe_customer_id } = user;
    const payload: JwtPayload = {
      sub: id,
      external_id,
      stripe_customer_id,
    };
    console.log(stripe_customer_id);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
