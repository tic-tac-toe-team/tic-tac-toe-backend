export class BoardResponseDto {
  gameId: number;
  state: string;
  cells: CellDto[];
  players: PlayerDto[];
}

export class PlayerDto {
  playerId: number;
  symbol: string;
  isCurrent: boolean;
}

export class CellDto {
  id: number;
  position: number;
  symbol: string;
}