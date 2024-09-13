import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { CreatePlayerRequestDto } from '../dtos/create-player-request.dto';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { Public } from 'src/decorators/public.decorator';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { CreatePlayerResponseDto } from '../dtos/create-player-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createPlayerDto: CreatePlayerRequestDto): Promise<CreatePlayerResponseDto> {
   return this.authService.register(createPlayerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginPlayerDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginPlayerDto);
  }
}
