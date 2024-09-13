import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PlayerGame } from '@prisma/client';
import { PlayerGameRepository } from '../repositories/player-game.repository';
import { SymbolEnum } from '../enums/symbol.enum';

@Injectable()
export class PlayerGameService {
  constructor(private readonly playerGameRepository: PlayerGameRepository) {}

  async create(data: { gameId: number; playerId: number; symbol: SymbolEnum; isCurrentPlayer: boolean;
  }): Promise<PlayerGame> {
    return this.playerGameRepository.createPlayerGame(data);
  }

  async changeCurrentPlayer(gameId: number): Promise<PlayerGame> {
    const gamePlayers = await this.playerGameRepository.findAllPlayersByGameId(gameId);

    if (gamePlayers.length !== 2) {
      throw new BadRequestException('Invalid number of players in the game');
    }

    const currentPlayer = gamePlayers.find((pg) => pg.isCurrentPlayer);
    const nextPlayer = gamePlayers.find((pg) => !pg.isCurrentPlayer);

    if (!currentPlayer || !nextPlayer) {
      throw new BadRequestException('Unable to determine current player');
    }

    await this.playerGameRepository.updatePlayerGame(currentPlayer.id, {
      isCurrentPlayer: false,
    });

    return this.playerGameRepository.updatePlayerGame(nextPlayer.id, {
      isCurrentPlayer: true,
    });
  }

  async getCurrentPlayer(gameId: number): Promise<PlayerGame> {
    const gamePlayers = await this.playerGameRepository.findAllPlayersByGameId(gameId);

    const currentPlayer = gamePlayers.find((pg) => pg.isCurrentPlayer);

    if (!currentPlayer) {
      throw new NotFoundException('Current player not found for this game');
    }

    return currentPlayer;
  }

  async setCurrentPlayer(gameId: number, symbol: SymbolEnum): Promise<void> {
    const players = await this.getAllPlayersByGameId(gameId);

    const currentPlayer = players.find(player => player.symbol === symbol);

    if (!currentPlayer) {
      throw new NotFoundException(`Player with symbol ${symbol} not found`);
    }

    await this.update(currentPlayer.id, { isCurrentPlayer: true });

    const otherPlayers = players.filter((player) => player.symbol !== symbol);

    for (const player of otherPlayers) {
      await this.update(player.id, { isCurrentPlayer: false });
    }
  }

  async update(playerId: number, updateData: Partial<PlayerGame>): Promise<PlayerGame> {
    return this.playerGameRepository.updatePlayerGame(playerId, updateData);
  }

  async getAllPlayersByGameId(gameId: number): Promise<PlayerGame[]> {
    return await this.playerGameRepository.findAllPlayersByGameId(gameId);
  }

  async determinePlayersSymbol(players: PlayerGame[]): Promise<SymbolEnum> {
    const isSinglePlayerInGame = players.length === 1;

    return isSinglePlayerInGame
      ? (players[0].symbol === SymbolEnum.X ? SymbolEnum.O : SymbolEnum.X)
      : SymbolEnum.X;
  }

  async deletePlayer(gameId: number, playerId: number): Promise<void> {
    const existPlayers = await this.playerGameRepository.findAllPlayersByGameId(gameId);

    if (!existPlayers) {
      throw new BadRequestException('Player not found in this game.');
    }

    await this.playerGameRepository.delete(gameId, playerId);
  }
}
