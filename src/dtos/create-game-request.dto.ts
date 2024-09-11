import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty()
  @IsInt()
  playerOneId: number;

  @ApiProperty()
  @IsInt()
  playerTwoId: number;
}