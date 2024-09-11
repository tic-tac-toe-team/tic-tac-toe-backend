import { BadRequestException, Injectable } from '@nestjs/common';
import { BoardRepository } from '../../repositories/board.repository';
import { SymbolEnum } from '../../enums/symbol.enum';
import { GameStateEnum } from '../../enums/game-state.enum';
import { CellService } from '../cell/cell.service';
import { PlayerGameService } from '../player-game/player-game.service';
import { Player } from '@prisma/client';
import { CreateGameResponseDto } from '../../dtos/create-game-response.dto';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private cellService: CellService,
    private readonly playerGameService: PlayerGameService,
  ) {}

  private readonly PLAYERS_COUNT = 2;

  async getAllGames(): Promise<any[]> {
    return this.boardRepository.getAllGames();
  }

  // async createGame(players: Player[]): Promise<CreateGameResponseDto> {
  //   if (players.length !== this.PLAYERS_COUNT) {
  //     throw new BadRequestException(
  //       `A game must have exactly ${this.PLAYERS_COUNT} players.`,
  //     );
  //   }
  //
  //   const game = await this.boardRepository.createGame(GameStateEnum.ONGOING);
  //
  //   await this.addPlayersToGame(game.id, players);
  //
  //   await this.cellService.createCellsForNewGame(game.id);
  //
  //   return { gameId: game.id };
  // }

  async createGame(playerOneId: number, playerTwoId: number): Promise<CreateGameResponseDto> {
    if (!playerOneId || !playerTwoId) {
      throw new BadRequestException(`The IDs of two players must be transmitted.`);
    }

    const game = await this.boardRepository.createGame(GameStateEnum.ONGOING);

    await this.addPlayersToGame(game.id, playerOneId, playerTwoId);

    await this.cellService.createCellsForNewGame(game.id);

    return { gameId: game.id };
  }

  private async addPlayersToGame(gameId: number, playerOneId: number, playerTwoId: number): Promise<void> {
    await this.playerGameService.createPlayerGame(gameId, playerOneId, SymbolEnum.X, true);
    await this.playerGameService.createPlayerGame(gameId, playerTwoId, SymbolEnum.O, false);
  }
  // private async addPlayersToGame(gameId: number, players: Player[]): Promise<void> {
  //   await this.playerGameService.createPlayerGame(gameId, players[0].id, SymbolEnum.X, true);
  //   await this.playerGameService.createPlayerGame(gameId, players[1].id, SymbolEnum.O, false);
  // }

  async makeMove(gameId: number, position: number): Promise<void> {
    const game = await this.boardRepository.getGameById(gameId);

    if (game.state !== GameStateEnum.ONGOING) {
      throw new BadRequestException('Game has already ended');
    }

    const currentPlayer = await this.playerGameService.getCurrentPlayer(gameId);

    await this.cellService.fillCell(gameId, position, currentPlayer.symbol as SymbolEnum);

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

  async getGameBoard(gameId: number): Promise<any[]> {
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
