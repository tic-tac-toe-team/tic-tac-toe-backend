import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PlayerGame } from '@prisma/client';
import { PlayerGameRepository } from '../../repositories/player-game.repository';

@Injectable()
export class PlayerGameService {
  constructor(private readonly playerGameRepository: PlayerGameRepository) {}

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
}
