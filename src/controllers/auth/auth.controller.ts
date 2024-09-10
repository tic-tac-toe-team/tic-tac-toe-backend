import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../services/auth/auth.service';
import { CreatePlayerDto } from '../../dtos/create-player.dto';
import { LoginRequestDto } from '../../dtos/login-request.dto';

import { Public } from 'src/decorators/public.decorator';
import { LoginResponseDto } from '../../dtos/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createPlayerDto: CreatePlayerDto): Promise<LoginResponseDto> {
    const player = await this.authService.register(createPlayerDto);

    return new LoginResponseDto(player.id, player.username);
  }

  @Public()
  @Post('login')
  async login(@Body() loginPlayerDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginPlayerDto);
  }
}
