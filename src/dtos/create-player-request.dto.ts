import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePlayerRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
