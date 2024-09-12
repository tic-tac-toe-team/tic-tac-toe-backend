import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { GameStateEnum } from '../enums/game-state.enum';
import { Game } from '@prisma/client';

@Injectable()
export class BoardRepository {
  constructor(private prisma: PrismaService) {}

  async create(state: GameStateEnum): Promise<Game> {
    return this.prisma.game.create({
      data: {
        state,
      },
    });
  }

  async getAllGames(): Promise<any[]> {
    return this.prisma.game.findMany({
      include: {
        PlayerGame: {
          select: {
            symbol: true,
            isCurrentPlayer: true,
            playerId: true,
            player: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async getBoardById(id: number): Promise<Game> {
    return this.prisma.game.findUnique({
      where: { id },
    });
  }

  async getGameById(id: number): Promise<any> {
    return this.prisma.game.findUnique({
      where: { id },
      include: {
        PlayerGame: {
          select: {
            symbol: true,
            isCurrentPlayer: true,
            playerId: true,
            player: {
              select: {
                username: true,
              },
            },
          },
        },
        Cell: {
          select: {
            id: true,
            position: true,
            symbol: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  async updateGameState(id: number, state: GameStateEnum): Promise<any> {
    return this.prisma.game.update({
      where: { id },
      data: { state },
    });
  }

  async delete(boardId: number): Promise<void> {
    await this.prisma.cell.deleteMany({
      where: { gameId: boardId },
    });

    await this.prisma.game.delete({
      where: { id: boardId },
    });
  }
}
