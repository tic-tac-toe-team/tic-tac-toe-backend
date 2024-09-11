import { Injectable } from '@nestjs/common';
import { Game, PlayerGame, Cell } from '@prisma/client';
import { BoardResponseDto, CellDto, PlayerDto } from '../dtos/board-response.dto';

@Injectable()
export class DtoMapperService {
  mapToBoardResponseDto(game: Game, players: PlayerGame[], cells: Cell[]): BoardResponseDto {
    return {
      gameId: game.id,
      state: game.state,
      cells: cells.map(cell => this.mapToCellDto(cell)),
      players: players.map(player => this.mapToPlayerDto(player)),
    };
  }

  private mapToCellDto(cell: Cell): CellDto {
    return {
      id: cell.id,
      position: cell.position,
      symbol: cell.symbol
    };
  }

  private mapToPlayerDto(player: PlayerGame): PlayerDto {
    return {
      playerId: player.playerId,
      symbol: player.symbol,
      isCurrentPlayer: player.isCurrentPlayer
    };
  }
}
