import { BadRequestException, Injectable } from '@nestjs/common';
import { GameRepository } from '../repositories/game.repository';
import { SymbolEnum } from '../enums/symbol.enum';
import { GameStateEnum } from '../enums/game-state.enum';
import { CellService } from './cell.service';
import { PlayerGameService } from './player-game.service';
import { DtoMapperService } from './dto-mapper.service';
import { GameResponseDto } from '../dtos/game-response.dto';

@Injectable()
export class GameService {
  constructor(
    private gameRepository: GameRepository,
    private cellService: CellService,
    private dtoMapperService: DtoMapperService,
    private readonly playerGameService: PlayerGameService,
  ) {}

  async getAll(): Promise<GameResponseDto[]> {
    const games = await this.gameRepository.getAll();

    const gameDtos = await Promise.all(
      games.map(async (game) => {
        const cells = await this.cellService.getAllByGameId(game.id);
        const players = await this.playerGameService.getAllPlayersByGameId(game.id);

        return this.dtoMapperService.mapToGameResponseDto(game, players, cells);
      }),
    );

    return gameDtos;
  }

  async create(playerId: number): Promise<GameResponseDto> {
    const game = await this.gameRepository.create(GameStateEnum.ONGOING);

    const playerGame = await this.playerGameService.create({
      gameId: game.id,
      playerId,
      symbol: SymbolEnum.X,
      isCurrentPlayer: true,
    });

    await this.cellService.create(game.id);

    const players = [playerGame];
    const cells = await this.cellService.getAllByGameId(game.id);

    return this.dtoMapperService.mapToGameResponseDto(game, players, cells);
  }

  async joinPlayer(gameId: number, playerId: number): Promise<GameResponseDto> {
    const MAX_PLAYERS = 2;

    const players = await this.playerGameService.getAllPlayersByGameId(gameId);
    const playerCount = players.length;

    const game = await this.gameRepository.getById(gameId);
    const cells = await this.cellService.getAllByGameId(gameId);

    if (playerCount >= MAX_PLAYERS) {
      throw new BadRequestException('This game already has two players.');
    }

    const symbol = await this.playerGameService.determinePlayersSymbol(players);

    const playerGame = await this.playerGameService.create({
      gameId,
      playerId,
      symbol,
      isCurrentPlayer: false,
    });

    players.push(playerGame);

    return this.dtoMapperService.mapToGameResponseDto(game, players, cells);
  }

  async leaveGame(gameId: number, playerId: number): Promise<void> {
    await this.playerGameService.deletePlayer(gameId, playerId);

    const existPlayers = await this.playerGameService.getAllPlayersByGameId(gameId);

    if (!existPlayers) {
      await this.gameRepository.delete(gameId);
    }
  }

  async makeMove(gameId: number, position: number): Promise<GameResponseDto> {
    const currentGameState = await this.getState(gameId);
    const playerCount = await this.playerGameService.getAllPlayersByGameId(gameId);

    if (currentGameState !== GameStateEnum.ONGOING) {
      throw new BadRequestException('Game has already ended');
    }

    if (playerCount.length < 2) {
      throw new BadRequestException('Cannot make a move without two players in the game.');
    }

    const currentPlayer = await this.playerGameService.getCurrentPlayer(gameId);

    await this.cellService.fillCell(gameId, position, SymbolEnum[currentPlayer.symbol]);

    const cells = await this.cellService.getAllByGameId(gameId);
    const gameState = this.checkGameState(cells);

    await this.gameRepository.updateState(gameId, gameState);

    const game = await this.gameRepository.getById(gameId);

    if (gameState === GameStateEnum.ONGOING) {
      await this.playerGameService.changeCurrentPlayer(gameId);
    }

    const players = await this.playerGameService.getAllPlayersByGameId(gameId);

    return this.dtoMapperService.mapToGameResponseDto(game, players, cells);
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

  async getById(gameId: number): Promise<GameResponseDto> {
    const game = await this.gameRepository.getById(gameId);
    const cells = await this.cellService.getAllByGameId(gameId);
    const players = await this.playerGameService.getAllPlayersByGameId(gameId);

    return this.dtoMapperService.mapToGameResponseDto(game, players, cells);
  }

  async getState(gameId: number): Promise<string> {
    const game = await this.gameRepository.getById(gameId);

    return game.state;
  }

  async resetGame(gameId: number): Promise<void> {
    await this.gameRepository.updateState(gameId, GameStateEnum.ONGOING);
    await this.cellService.resetCells(gameId);
    await this.playerGameService.setCurrentPlayer(gameId, SymbolEnum.X);
  }
}
