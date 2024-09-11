import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerService } from './services/player.service';
import { PlayerController } from './controllers/player.controller';
import { PrismaService } from './services/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './services/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './services/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CryptoService } from './services/crypto.service';
import { BoardController } from './controllers/board.controller';
import { BoardService } from './services/board.service';
import { BoardRepository } from './repositories/board.repository';
import { CellRepository } from './repositories/cell.repository';
import { PlayerGameRepository } from './repositories/player-game.repository';
import { CellService } from './services/cell.service';
import { PlayerGameService } from './services/player-game.service';

const controllers = [
  PlayerController,
  AuthController,
  BoardController,
];

const repositories = [
  PlayerRepository,
  BoardRepository,
  CellRepository,
  PlayerGameRepository
];

const services = [
  PlayerService,
  AuthService,
  PrismaService,
  LocalStrategy,
  LocalAuthGuard,
  JwtStrategy,
  CryptoService,
  BoardService,
  CellService,
  PlayerGameService,
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
    },
  ],
})
export class AppModule {}
