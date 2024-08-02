import { Module } from '@nestjs/common';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { GithubOauthModule } from './github/github-oauth.module';
import { LocalAuthService } from './local/local-auth.service';
import { LocalStrategy } from './local/local.strategy';
import { LocalAuthController } from './local/local-auth.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
import { GoogleOauthModule } from './google/google-oauth.module';

@Module({
  imports: [
    UsersModule,
    JwtAuthModule,
    GithubOauthModule,
    GoogleOauthModule,
    PrismaModule,
    SharedModule,
  ],
  providers: [LocalAuthService, LocalStrategy],
  controllers: [LocalAuthController],
})
export class AuthModule {}
