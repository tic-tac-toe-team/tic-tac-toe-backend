import { IsInt } from 'class-validator';

export class MakeMoveRequestDto {
  @IsInt()
  position: number;

  @IsInt()
  playerId: number;
}
