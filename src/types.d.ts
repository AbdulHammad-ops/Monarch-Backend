import { User } from '@prisma/client';
import { JwtPayload } from './shared';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
