import { BadRequestException, Injectable } from '@nestjs/common';
import { BoardRepository } from '../../repositories/board.repository';
import { SymbolEnum } from '../../enums/symbol.enum';
import { GameStateEnum } from '../../enums/game-state.enum';
import { CellService } from '../cell/cell.service';
import { PlayerGameService } from '../player-game/player-game.service';
import { Player } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private cellService: CellService,
    private readonly playerGameService: PlayerGameService,
  ) {}

  async createGame(players: Player[]): Promise<number> {
    if (players.length !== 2) {
      throw new BadRequestException('A game must have exactly 2 players.');
    }

    const game = await this.boardRepository.createGame(GameStateEnum.ONGOING);

    await this.addPlayersToGame(game.id, players);

    await this.cellService.createCellsForNewGame(game.id);

    return game.id;
  }

  private async addPlayersToGame(gameId: number, players: Player[]): Promise<void> {

  }

  async makeMove(gameId: number, position: number): Promise<void> {
    const game = await this.boardRepository.getGameById(gameId);

    if (game.state !== GameStateEnum.ONGOING) {
      throw new BadRequestException('Game has already ended');
    }

    const currentPlayer = await this.playerGameService.getCurrentPlayer(gameId);

    await this.cellService.fillCell(gameId, position, currentPlayer.symbol as SymbolEnum);

    const cells = await this.boardRepository.getCellsByGame(gameId);
    const gameState = this.checkGameState(cells);

    await this.boardRepository.updateGameState(gameId, gameState);

    if (gameState === GameStateEnum.ONGOING) {
      await this.playerGameService.changeCurrentPlayer(gameId);
    }
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

  async getGameBoard(gameId: number): Promise<any> {
    const game = await this.boardRepository.getGameById(gameId);
    const cells = await this.boardRepository.getCellsByGame(gameId);
    return { game, cells };
  }

  async resetGame(gameId: number): Promise<void> {
    await this.boardRepository.updateGameState(gameId, GameStateEnum.ONGOING);
    await this.cellService.resetCells(gameId);
  }
}
