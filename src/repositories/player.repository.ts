import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Player } from '@prisma/client';

@Injectable()
export class PlayerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<Player> {
    return this.prismaService.player.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string): Promise<Player> {
    return this.prismaService.player.findUnique({
      where: { username },
    });
  }

  async findAll(): Promise<Player[]> {
    return this.prismaService.player.findMany();
  }

  async create(username: string, password: string): Promise<Player> {
    return this.prismaService.player.create({
      data: { username, password },
    });
  }

  async delete(id: number): Promise<Player> {
    return this.prismaService.player.delete({
      where: { id },
    });
  }
}
