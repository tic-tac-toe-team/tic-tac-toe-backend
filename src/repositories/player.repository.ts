import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Player } from '@prisma/client';

@Injectable()
export class PlayerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findPlayerById(id: number): Promise<Player> {
    return this.prismaService.player.findUnique({
      where: { id },
    });
  }

  async findAllPlayers(): Promise<Player[]> {
    return this.prismaService.player.findMany();
  }

  async createPlayer(username: string, password: string): Promise<Player> {
    return this.prismaService.player.create({
      data: { username, password },
    });
  }

  async deletePlayer(id: number): Promise<Player> {
    return this.prismaService.player.delete({
      where: { id },
    });
  }
}
