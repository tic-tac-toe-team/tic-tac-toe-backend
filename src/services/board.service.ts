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
    const board = await this.boardRepository.create(GameStateEnum.ONGOING);

    const playerBoard = await this.playerGameService.create({
      boardId: board.id,
      playerId,
      symbol: SymbolEnum.X,
      isCurrentPlayer: true
    });

    await this.cellService.create(board.id);

    const players = [playerBoard];
    const cells = await this.cellService.getAllByBoardId(board.id);

    return this.dtoMapperService.mapToBoardResponseDto(board, players, cells);
  }

  async joinPlayer(boardId: number, playerId: number): Promise<BoardResponseDto> {
    const MAX_PLAYERS = 2;

    const players = await this.playerGameService.getAllPlayers(boardId);
    const playerCount = players.length;

    const board = await this.boardRepository.getBoardById(boardId);
    const cells = await this.cellService.getAllByBoardId(boardId);

    if (playerCount >= MAX_PLAYERS) {
      throw new BadRequestException('This game already has two players.');
    }

    const symbol = this.playerGameService.determinePlayersSymbol(players);

    const playerBoard = await this.playerGameService.create({
      boardId,
      playerId,
      symbol,
      isCurrentPlayer: false
    });

    players.push(playerBoard);

    return this.dtoMapperService.mapToBoardResponseDto(board, players, cells);
  }

  async leaveGame(boardId: number, playerId: number): Promise<void> {
    await this.playerGameService.deletePlayer(boardId, playerId);

    const existPlayers = await this.playerGameService.getAllPlayers(boardId);

    if (!existPlayers) {
      await this.boardRepository.delete(boardId);
    }
  }

  async makeMove(gameId: number, position: number): Promise<CellResponseDto[]> {
    const game = await this.boardRepository.getGameById(gameId);

    if (game.state !== GameStateEnum.ONGOING) {
      throw new BadRequestException('Game has already ended');
    }

    const currentPlayer = await this.playerGameService.getCurrentPlayer(gameId);

    await this.cellService.fillCell(gameId, position, SymbolEnum[currentPlayer.symbol]);

    const cells = await this.cellService.getAllByBoardId(gameId);
    const gameState = this.checkGameState(cells);

    await this.boardRepository.updateGameState(gameId, gameState);

    if (gameState === GameStateEnum.ONGOING) {
      await this.playerGameService.changeCurrentPlayer(gameId);
    }

    return cells;
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
        cells[a].symbol !== '' &&
        cells[a].symbol === cells[b].symbol &&
        cells[a].symbol === cells[c].symbol
      ) {
        return GameStateEnum.WIN;
      }
    }

    const isDraw = cells.every((cell) => cell.symbol !== '');

    return isDraw ? GameStateEnum.DRAW : GameStateEnum.ONGOING;
  }

  async getGameBoard(gameId: number): Promise<any[]> {
    return await this.boardRepository.getGameById(gameId);
  }

  async getGameState(gameId: number): Promise<string> {
    const game = await this.boardRepository.getBoardById(gameId);

    return game.state;
  }

  async resetGame(gameId: number): Promise<string> {
    await this.boardRepository.updateGameState(gameId, GameStateEnum.ONGOING);
    await this.cellService.resetCells(gameId);

    return 'Game has been reset successfully';
  }
}
