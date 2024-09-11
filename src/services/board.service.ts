import { BadRequestException, Injectable } from '@nestjs/common';
import { BoardRepository } from '../repositories/board.repository';
import { SymbolEnum } from '../enums/symbol.enum';
import { GameStateEnum } from '../enums/game-state.enum';
import { CellService } from './cell.service';
import { PlayerGameService } from './player-game.service';
import { CellResponseDto } from '../dtos/cell-response.dto';
import { DtoMapperService } from './dto-mapper.service';
import { BoardResponseDto } from '../dtos/board-response.dto';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private cellService: CellService,
    private dtoMapperService: DtoMapperService,
    private readonly playerGameService: PlayerGameService,
  ) {}

  async getAllGames(): Promise<any[]> {
    return this.boardRepository.getAllGames();
  }

  async create(playerId: number): Promise<BoardResponseDto> {
    const game = await this.boardRepository.createGame(GameStateEnum.ONGOING);

    const playerGame = await this.playerGameService.create({
      gameId: game.id,
      playerId,
      symbol: SymbolEnum.X,
      isCurrentPlayer: true
    });

    await this.cellService.createCellsForNewGame(game.id);

    const players = [playerGame];
    const cells = await this.cellService.getCellsByGame(game.id);

    return this.dtoMapperService.mapToBoardResponseDto(game, players, cells);
  }

  async joinPlayer(gameId: number, playerId: number): Promise<BoardResponseDto> {
    const game = await this.boardRepository.getGameById(gameId);
    const players = await this.playerGameService.getPlayersInGame(gameId);
    const cells = await this.cellService.getCellsByGame(gameId);

    if (players.length >= 2) {
      throw new BadRequestException('This game already has two players.');
    }

    const symbol = this.playerGameService.determinePlayersSymbol(players);

    const playerGame = await this.playerGameService.create({
      gameId,
      playerId,
      symbol,
      isCurrentPlayer: false
    });

    players.push(playerGame);

    return this.dtoMapperService.mapToBoardResponseDto(game, players, cells);
  }

  async leaveGame(gameId: number, playerId: number): Promise<void> {
    // return this.playerGameService.removeFromGame(gameId, playerId);
  }

  async makeMove(gameId: number, position: number): Promise<void> {
    const game = await this.boardRepository.getGameById(gameId);

    if (game.state !== GameStateEnum.ONGOING) {
      throw new BadRequestException('Game has already ended');
    }

    const currentPlayer = await this.playerGameService.getCurrentPlayer(gameId);

    await this.cellService.fillCell(gameId, position, SymbolEnum[currentPlayer.symbol]);

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

  async resetGame(gameId: number): Promise<string> {
    await this.boardRepository.updateGameState(gameId, GameStateEnum.ONGOING);
    await this.cellService.resetCells(gameId);

    return 'Game has been reset successfully';
  }
}
