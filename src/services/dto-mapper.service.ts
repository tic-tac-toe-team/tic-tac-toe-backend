import { Injectable } from '@nestjs/common';
import { Game, PlayerGame, Cell } from '@prisma/client';
import { PlayerGameResponseDto, PlayerDto, GameDto, CellDto } from '../dtos/player-game-response.dto';

@Injectable()
export class DtoMapperService {
  mapGameToPlayerGameResponseDto(game: Game, players: PlayerGame[], cells: Cell[]): PlayerGameResponseDto {
    return {
      game: this.mapGameToGameDto(game, cells),
      players: players.map(player => this.mapPlayerToPlayerDto(player))
    };
  }

  private mapGameToGameDto(game: Game, cells: Cell[]): GameDto {
    return {
      id: game.id,
      state: game.state,
      cells: cells.map(cell => this.mapCellToCellDto(cell))
    };
  }

  private mapCellToCellDto(cell: Cell): CellDto {
    return {
      id: cell.id,
      position: cell.position,
      symbol: cell.symbol
    };
  }

  private mapPlayerToPlayerDto(player: PlayerGame): PlayerDto {
    return {
      playerId: player.playerId,
      symbol: player.symbol,
      isCurrentPlayer: player.isCurrentPlayer
    };
  }
}
