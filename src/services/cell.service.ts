import { Injectable } from '@nestjs/common';
import { SymbolEnum } from '../enums/symbol.enum';
import { CellRepository } from '../repositories/cell.repository';
import { CellResponseDto } from '../dtos/cell-response.dto';

@Injectable()
export class CellService {
  private readonly TOTAL_CELLS = 9;
  constructor(private cellRepository: CellRepository) {}

  async create(gameId: number): Promise<void> {
    for (let i = 0; i < this.TOTAL_CELLS; i++) {
      await this.cellRepository.create(gameId, i, SymbolEnum.NULL);
    }
  }

  async resetCells(gameId: number): Promise<void> {
    await this.cellRepository.updateAll(gameId, SymbolEnum.NULL);
  }

  async fillCell(gameId: number, position: number, symbol: SymbolEnum): Promise<void> {
    const cell = await this.cellRepository.getByGameIdAndPosition(gameId, position);

    if (cell.symbol === SymbolEnum.NULL) {
      await this.cellRepository.update(cell.id, symbol);
    } else {
      throw new Error('Cell is already occupied');
    }
  }

  async getAllByGameId(gameId: number): Promise<CellResponseDto[]> {
    return await this.cellRepository.getAllByGameId(gameId);
  }
}
