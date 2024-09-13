import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinPlayerRequestDto {
  @IsNumber()
  @IsNotEmpty()
  playerId: number;
}
