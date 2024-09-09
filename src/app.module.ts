import { Module } from '@nestjs/common';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerService } from './services/player/player.service';
import { PlayerController } from './controllers/player/player.controller';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { LocalStrategy } from './services/auth/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';

const controllers = [
  PlayerController,
  AuthController,
];

const repositories = [
  PlayerRepository
];

const services = [
  PlayerService,
  AuthService,
  PrismaService,
  LocalStrategy,
  LocalAuthGuard
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [...controllers],
  providers: [...services, ...repositories],
})
export class AppModule {}
