import { Injectable } from '@nestjs/common';
import { SymbolEnum } from '../enums/symbol.enum';
import { CellRepository } from '../repositories/cell.repository';
import { CellResponseDto } from '../dtos/cell-response.dto';

@Injectable()
export class CellService {
  private readonly TOTAL_CELLS = 9;
  constructor(private cellRepository: CellRepository) {}

  async createCellsForNewGame(gameId: number): Promise<void> {
    for (let i = 0; i < this.TOTAL_CELLS; i++) {
      await this.cellRepository.createCell(gameId, i, SymbolEnum.NULL);
    }
  }

  async resetCells(gameId: number): Promise<void> {
    await this.cellRepository.updateCells(gameId, SymbolEnum.NULL);
  }

  async fillCell(gameId: number, position: number, symbol: SymbolEnum): Promise<void> {
    const cell = await this.cellRepository.getCell(gameId, position);

    if (cell.symbol === SymbolEnum.NULL) {
      await this.cellRepository.updateCell(cell.id, symbol);
    } else {
      throw new Error('Cell is already occupied');
    }
  }

  async getCellsByGame(gameId: number): Promise<CellResponseDto[]> {
    return await this.cellRepository.getCellsByGame(gameId);
  }
}
