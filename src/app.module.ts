import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerService } from './services/player/player.service';
import { PlayerController } from './controllers/player/player.controller';
import { PrismaService } from './prisma.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { LocalStrategy } from './services/auth/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './services/auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const controllers = [
  PlayerController,
  AuthController,
];

const repositories = [
  PlayerRepository,
];

const services = [
  PlayerService,
  AuthService,
  PrismaService,
  LocalStrategy,
  LocalAuthGuard,
  JwtStrategy,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [...controllers],
  providers: [...services, ...repositories,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
})
export class AppModule {}
