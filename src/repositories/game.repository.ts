import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { GameStateEnum } from '../enums/game-state.enum';
import { Game } from '@prisma/client';

@Injectable()
export class GameRepository {
  constructor(private prisma: PrismaService) {}

  async create(state: GameStateEnum): Promise<Game> {
    return this.prisma.game.create({
      data: {
        state,
      },
    });
  }

  async getAll(): Promise<any[]> {
    return this.prisma.game.findMany({
      orderBy: {
        id: 'asc',
      } as any,
    });
  }

  async getById(id: number): Promise<Game> {
    return this.prisma.game.findUnique({
      where: { id },
    });
  }

  async updateState(id: number, state: GameStateEnum): Promise<any> {
    return this.prisma.game.update({
      where: { id },
      data: { state },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.cell.deleteMany({
      where: { gameId: id },
    });

    await this.prisma.game.delete({
      where: { id: id },
    });
  }
}
