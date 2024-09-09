import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../../services/auth/auth.service';
import { CreatePlayerDto } from '../../dtos/create-player.dto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { LoginPlayerDto } from '../../dtos/login-player.dto';
import { PlayerResponseDto } from '../../dtos/player-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createPlayerDto: CreatePlayerDto): Promise<PlayerResponseDto> {
    const player = await this.authService.register(createPlayerDto);

    return new PlayerResponseDto(player.id, player.username);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginPlayerDto: LoginPlayerDto): Promise<PlayerResponseDto> {
    return this.authService.login(loginPlayerDto);
  }
}
