/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/entity/user.entity';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(credential: string, pass: string): Promise<any> {
    const accountNumber = credential.includes('@') ? '' : credential;
    let user: User | null = null;
    if (accountNumber) {
      user = await this.userService.findByPhone(accountNumber);
    } else {
      user = await this.userService.findByEmail(credential);
    }
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginInput: LoginInput) {
    const user: User = await this.validateUser(
      loginInput.credential,
      loginInput.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, phone: user.phone };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user,
    };
  }
}
