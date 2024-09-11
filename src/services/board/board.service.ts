import { BadRequestException, Injectable } from '@nestjs/common';
import { BoardRepository } from '../../repositories/board.repository';
import { SymbolEnum } from '../../enums/symbol.enum';
import { GameStateEnum } from '../../enums/game-state.enum';
import { CellService } from '../cell/cell.service';
import { PlayerGameService } from '../player-game/player-game.service';
import { CellResponseDto } from '../../dtos/cell-response.dto';
import { PlayerGameResponseDto } from '../../dtos/player-game-response.dto';
import { BoardResponseDto } from '../../dtos/board-response.dto';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private cellService: CellService,
    private readonly playerGameService: PlayerGameService,
  ) {}

  async createGame(): Promise<BoardResponseDto> {
    const game = await this.boardRepository.createGame(GameStateEnum.ONGOING);

    await this.cellService.createCellsForNewGame(game.id);

    return { gameId: game.id, state: game.state };
  }

  async createGameWithPlayer(playerId: number): Promise<PlayerGameResponseDto> {
    const game = await this.boardRepository.createGame(GameStateEnum.ONGOING);

    const playerGame = await this.playerGameService.createPlayerGame({
      gameId: game.id,
      playerId: playerId,
      symbol: SymbolEnum.X,
      isCurrentPlayer: true,
    });

    await this.cellService.createCellsForNewGame(game.id);

    return {
      gameId: game.id,
      playerId: playerGame.playerId,
      symbol: playerGame.symbol,
      isCurrentPlayer: playerGame.isCurrentPlayer,
    };
  }

  async joinGame(gameId: number, playerId: number): Promise<PlayerGameResponseDto> {
    const playersInGame = await this.playerGameService.getPlayersInGame(gameId);

    if (playersInGame.length >= 2) {
      throw new BadRequestException('This game already has two players. A third player cannot join.');
    }

    const isPlayerAlreadyInGame = playersInGame.some(player => player.playerId === playerId);

    if (isPlayerAlreadyInGame) {
      throw new BadRequestException('This player is already part of the game.');
    }

    const playerGame = await this.playerGameService.createPlayerGame({
      gameId,
      playerId,
      symbol: SymbolEnum.O,
      isCurrentPlayer: false,
    });

    return {
      gameId: playerGame.gameId,
      playerId: playerGame.playerId,
      symbol: playerGame.symbol,
      isCurrentPlayer: playerGame.isCurrentPlayer,
    };
  }

  async makeMove(gameId: number, position: number): Promise<void> {
    const game = await this.boardRepository.getGameById(gameId);

    if (game.state !== GameStateEnum.ONGOING) {
      throw new BadRequestException('Game has already ended');
    }

    const currentPlayer = await this.playerGameService.getCurrentPlayer(gameId);

    await this.cellService.fillCell(gameId, position, SymbolEnum[currentPlayer.symbol as keyof typeof SymbolEnum]);

    const cells = await this.cellService.getCellsByGame(gameId);
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

    return isDraw ? GameStateEnum.DRAW : GameStateEnum.ONGOING;
  }

  async getGameBoard(gameId: number): Promise<CellResponseDto[]> {
    return await this.cellService.getCellsByGame(gameId);
  }

  async getGameState(gameId: number): Promise<string> {
    const game = await this.boardRepository.getGameById(gameId);

    return game.state;
  }

  async resetGame(gameId: number): Promise<void> {
    await this.boardRepository.updateGameState(gameId, GameStateEnum.ONGOING);
    await this.cellService.resetCells(gameId);
  }
}
