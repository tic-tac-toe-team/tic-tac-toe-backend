import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../services/auth/auth.service';
import { CreatePlayerDto } from '../../dtos/create-player.dto';
import { LoginPlayerDto } from '../../dtos/login-player.dto';
import { PlayerResponseDto } from '../../dtos/player-response.dto';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createPlayerDto: CreatePlayerDto): Promise<PlayerResponseDto> {
    const player = await this.authService.register(createPlayerDto);

    return new PlayerResponseDto(player.id, player.username);
  }

  @Public()
  @Post('login')
  async login(@Body() loginPlayerDto: LoginPlayerDto): Promise<PlayerResponseDto> {
    return this.authService.login(loginPlayerDto);
  }
}
