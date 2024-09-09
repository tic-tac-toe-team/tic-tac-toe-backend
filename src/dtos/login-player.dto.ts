import { IsNotEmpty, IsString } from 'class-validator';

export class LoginPlayerDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
