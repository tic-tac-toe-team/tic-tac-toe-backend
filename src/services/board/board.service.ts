import { BadRequestException, Injectable } from '@nestjs/common';
import { BoardRepository } from '../../repositories/board.repository';
import { SymbolEnum } from '../../enums/symbol.enum';
import { GameStateEnum } from '../../enums/game-state.enum';
import { CellService } from '../cell/cell.service';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private cellService: CellService,
  ) {}

  async makeMove(gameId: number, position: number, symbol: SymbolEnum): Promise<void> {
    const game = await this.boardRepository.getGameById(gameId);

    if (game.state !== GameStateEnum.ONGOING) {
      throw new BadRequestException('Game has already ended');
    }

    try {
      await this.cellService.fillCell(gameId, position, symbol);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const cells = await this.boardRepository.getCellsByGame(gameId);
    const gameState = this.checkGameState(cells);

    await this.boardRepository.updateGameState(gameId, gameState);
  }

  private checkGameState(cells: any[]): GameStateEnum {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        cells[a].symbol !== SymbolEnum.NULL &&
        cells[a].symbol === cells[b].symbol &&
        cells[a].symbol === cells[c].symbol
      ) {
        return GameStateEnum.WIN;
      }
    }

    const isDraw = cells.every((cell) => cell.symbol !== SymbolEnum.NULL);
    if (isDraw) {
      return GameStateEnum.DRAW;
    }

    return GameStateEnum.ONGOING;
  }
}