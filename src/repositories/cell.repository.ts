import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { SymbolEnum } from '../enums/symbol.enum';

@Injectable()
export class CellRepository {
  constructor(private prisma: PrismaService) {}

  async createCell(gameId: number, position: number, symbol: SymbolEnum): Promise<any> {
    return this.prisma.cell.create({
      data: { position, gameId, symbol },
    });
  }

  async getCellById(id: number): Promise<any> {
    return this.prisma.cell.findUnique({
      where: { id },
    });
  }

  async getCell(gameId: number, position: number): Promise<any> {
    return this.prisma.cell.findFirst({
      where: { gameId, position },
    });
  }

  async getCellsByGame(gameId: number): Promise<any[]> {
    const cells = await this.prisma.cell.findMany({
      where: { gameId },
    });

    return cells.sort((a, b) => a.position - b.position);
  }

  async updateCell(id: number, symbol: SymbolEnum): Promise<any> {
    return this.prisma.cell.update({
      where: { id },
      data: { symbol: symbol },
    });
  }

  async updateCells(gameId: number, symbol: SymbolEnum): Promise<any> {
    return this.prisma.cell.updateMany({
      where: { gameId },
      data: { symbol: symbol },
    });
  }

  async deleteCell(id: number): Promise<any> {
    return this.prisma.cell.delete({
      where: { id },
    });
  }
}
