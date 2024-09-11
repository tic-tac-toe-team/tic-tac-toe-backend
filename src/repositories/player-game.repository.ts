import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PlayerGame, Prisma } from '@prisma/client';

@Injectable()
export class PlayerGameRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPlayerGame(data: { gameId: number; symbol: string; isCurrentPlayer: boolean; playerId: number }): Promise<PlayerGame> {
    return this.prisma.playerGame.create({
      data,
    });
  }

  async findByGameIdAndPlayerId(gameId: number, playerId: number): Promise<PlayerGame | null> {
    return this.prisma.playerGame.findFirst({
      where: { gameId, playerId },
    });
  }

  async findAllPlayersByGameId(gameId: number): Promise<PlayerGame[]> {
    return this.prisma.playerGame.findMany({
      where: { gameId },
    });
  }

  async updatePlayerGame(id: number, data: Prisma.PlayerGameUpdateInput): Promise<PlayerGame> {
    return this.prisma.playerGame.update({
      where: { id },
      data,
    });
  }

  async deletePlayerFromGame(gameId: number, playerId: number): Promise<void> {
    await this.prisma.playerGame.deleteMany({
      where: {
        gameId,
        playerId,
      },
    });
  }
}
