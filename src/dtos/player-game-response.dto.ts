export class PlayerGameResponseDto {
  game: GameDto;
  players: PlayerDto[];
}

export class GameDto {
  id: number;
  state: string;
  cells: CellDto[];
}

export class PlayerDto {
  playerId: number;
  symbol: string;
  isCurrentPlayer: boolean;
}

export class CellDto {
  id: number;
  position: number;
  symbol: string;
}
