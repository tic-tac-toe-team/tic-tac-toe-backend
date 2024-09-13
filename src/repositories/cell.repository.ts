import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { SymbolEnum } from '../enums/symbol.enum';

@Injectable()
export class CellRepository {
  constructor(private prisma: PrismaService) {}

  async create(gameId: number, position: number, symbol: SymbolEnum): Promise<any> {
    return this.prisma.cell.create({
      data: { position, gameId, symbol },
    });
  }

  async getById(id: number): Promise<any> {
    return this.prisma.cell.findUnique({
      where: { id },
    });
  }

  async getByGameIdAndPosition(gameId: number, position: number): Promise<any> {
    return this.prisma.cell.findFirst({
      where: { gameId, position },
    });
  }

  async getAllByGameId(gameId: number): Promise<any[]> {
    const cells = await this.prisma.cell.findMany({
      where: { gameId },
    });

    return cells.sort((a, b) => a.position - b.position);
  }

  async update(id: number, symbol: SymbolEnum): Promise<any> {
    return this.prisma.cell.update({
      where: { id },
      data: { symbol: symbol },
    });
  }

  async updateAll(gameId: number, symbol: SymbolEnum): Promise<any> {
    return this.prisma.cell.updateMany({
      where: { gameId },
      data: { symbol: symbol },
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.cell.delete({
      where: { id },
    });
  }
}
