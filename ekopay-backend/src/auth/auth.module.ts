// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtService } from './jwt.service';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, JwtStrategy, AuthResolver, JwtService],
})
export class AuthModule {}
