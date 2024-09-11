import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PlayerGame } from '@prisma/client';
import { PlayerGameRepository } from '../repositories/player-game.repository';
import { SymbolEnum } from '../enums/symbol.enum';

@Injectable()
export class PlayerGameService {
  constructor(private readonly playerGameRepository: PlayerGameRepository) {}

  async create(data: { gameId: number; playerId: number; symbol: SymbolEnum; isCurrentPlayer: boolean }): Promise<PlayerGame> {
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

  async getPlayersInGame(gameId: number): Promise<PlayerGame[]> {
    return await this.playerGameRepository.findAllPlayersByGameId(gameId);
  }

  checkPlayerInGame(players: PlayerGame[], playerId: number): void {
    const isPlayerAlreadyInGame = players.some(player => player.playerId === playerId);

    if (isPlayerAlreadyInGame) {
      throw new BadRequestException('This player is already part of the game.');
    }
  }

  determinePlayersSymbol(players: PlayerGame[]): SymbolEnum {
    const isSinglePlayerInGame = players.length === 1;

    return isSinglePlayerInGame
      ? (players[0].symbol === SymbolEnum.X ? SymbolEnum.O : SymbolEnum.X)
      : SymbolEnum.X;
  }

  async removeFromGame(gameId: number, playerId: number): Promise<{ message: string }> {
    const playerGame = await this.playerGameRepository.findByGameIdAndPlayerId(gameId, playerId);

    if (!playerGame) {
      throw new BadRequestException('Player not found in this game.');
    }
    await this.playerGameRepository.deletePlayerFromGame(gameId, playerId);

    return { message: `Player with ID ${playerId} successfully left the game with ID ${gameId}` };
  }
}
