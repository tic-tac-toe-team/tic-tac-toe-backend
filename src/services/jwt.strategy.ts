import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    try {
      if (!payload || !payload.sub || !payload.username) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return { userId: payload.sub, username: payload.username };
    } catch (error) {
      throw new UnauthorizedException(
        'Token validation failed: ' + error.message,
      );
    }
  }
}
