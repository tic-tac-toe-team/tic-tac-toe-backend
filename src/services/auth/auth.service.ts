import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { CreatePlayerDto } from '../../dtos/create-player.dto';
import { LoginPlayerDto } from '../../dtos/login-player.dto';
import { Player } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PlayerResponseDto } from '../../dtos/player-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly playerService: PlayerService) {}

  async register(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const existingPlayer = await this.playerService.getByUsername(createPlayerDto.username);

    if (existingPlayer) {
      throw new BadRequestException('Username already exists');
    }

    return this.playerService.create(createPlayerDto);
  }

  async login(loginPlayerDto: LoginPlayerDto): Promise<PlayerResponseDto> {
    const player = await this.playerService.getByUsername(loginPlayerDto.username);

    if (!player) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(loginPlayerDto.password, player.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    return new PlayerResponseDto(player.id, player.username);
  }

  async validateUser(username: string, password: string): Promise<PlayerResponseDto> {
    const player = await this.playerService.getByUsername(username);

    if (!player) {
      return null;
    }

    const passwordValid = await bcrypt.compare(password, player.password);

    if (!passwordValid) {
      return null;
    }

    return new PlayerResponseDto(player.id, player.username);
  }
}
