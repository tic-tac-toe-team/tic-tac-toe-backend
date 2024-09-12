import { IsInt } from 'class-validator';

export class MakeMoveDto {
  @IsInt()
  position: number;
}
