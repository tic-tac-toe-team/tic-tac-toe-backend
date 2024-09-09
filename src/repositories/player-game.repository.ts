import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PlayerGame, Prisma } from '@prisma/client';

@Injectable()
export class PlayerGameRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async deletePlayerGame(id: number): Promise<PlayerGame> {
    return this.prisma.playerGame.delete({
      where: { id },
    });
  }
}
