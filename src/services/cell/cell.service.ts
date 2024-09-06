import { Injectable } from '@nestjs/common';
import { SymbolEnum } from '../../enums/symbol.enum';
import { CellRepository } from '../../repositories/cell.repository';

@Injectable()
export class CellService {
  constructor(private cellRepository: CellRepository) {}

  async createCellsForNewGame(gameId: number): Promise<void> {
    for(let i = 0; i < 9; i++) {
      await this.cellRepository.createCell(gameId, i, SymbolEnum.NULL);
    }
  }

  async resetCells(gameId: number): Promise<void> {
    const cells = await this.cellRepository.getCellsByGame(gameId);

    for (const cell of cells) {
      await this.cellRepository.updateCell(cell.id, SymbolEnum.NULL);
    }
  }

  async fillCell(gameId: number, position: number, symbol: SymbolEnum): Promise<void> {
    const cell = await this.cellRepository.getCell(gameId, position);

    if (cell.symbol === SymbolEnum.NULL) {
      await this.cellRepository.updateCell(cell.id, symbol);
    } else {
      throw new Error('Cell is already occupied');
    }
  }
}
