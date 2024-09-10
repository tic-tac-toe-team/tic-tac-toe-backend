import { IsNotEmpty } from 'class-validator';

export class CreateGameResponseDto {
  @IsNotEmpty
  gameId: number;
}