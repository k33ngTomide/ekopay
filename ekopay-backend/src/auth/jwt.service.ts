import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as JWT from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    this.jwtSecret = secret;
  }

  sign(payload: Record<string, any>): string {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload must be a non-empty object');
    }

    return JWT.sign(payload, this.jwtSecret, {
      expiresIn: '1d',
    });
  }
}
