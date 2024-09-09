import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GameStateEnum } from '../enums/game-state.enum';

@Injectable()
export class BoardRepository {
  constructor(private prisma: PrismaService) {}

  async getGameById(id: number): Promise<any> {
    return this.prisma.game.findUnique({
      where: { id },
    });
  }

  async updateGameState(id: number, state: GameStateEnum): Promise<any> {
    return this.prisma.game.update({
      where: { id },
      data: { state },
    });
  }

  async getCellsByGame(gameId: number): Promise<any[]> {
    return this.prisma.cell.findMany({
      where: { gameId },
    });
  }
}
