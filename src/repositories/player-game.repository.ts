import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { PlayerGame, Prisma } from '@prisma/client';

@Injectable()
export class PlayerGameRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPlayerGame(data: { gameId: number; symbol: string; isCurrentPlayer: boolean; playerId: number }): Promise<PlayerGame> {
    return this.prisma.playerGame.create({
      data,
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

  async delete(boardId: number, playerId: number): Promise<void> {
    await this.prisma.playerGame.delete({
      where: {
        playerGame: {
          gameId: boardId,
          playerId: playerId,
        },
      }
    });
  }
}