import { IsNotEmpty, IsNumber } from "class-validator";

export class LeaveGameRequestDto {
  @IsNumber()
  @IsNotEmpty()
  playerId: number;
}