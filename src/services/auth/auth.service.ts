import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { CreatePlayerDto } from '../../dtos/create-player.dto';
import { LoginPlayerDto } from '../../dtos/login-player.dto';
import { Player } from '@prisma/client';
import { PlayerResponseDto } from '../../dtos/player-response.dto';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  async register(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const existingPlayer = await this.playerService.getByUsername(
      createPlayerDto.username,
    );

    if (existingPlayer) {
      throw new BadRequestException('Username already exists');
    }

    createPlayerDto.password = await this.cryptoService.hashPassword(createPlayerDto.password);

    return this.playerService.create(createPlayerDto);
  }

  async login(loginPlayerDto: LoginPlayerDto): Promise<PlayerResponseDto> {
    const player = await this.playerService.getByUsername(
      loginPlayerDto.username,
    );

    if (!player) {
      throw new UnauthorizedException('Invalid credentials: User does not exist.');
    }

    const passwordValid = await this.cryptoService.comparePasswords(
      loginPlayerDto.password,
      player.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials: Incorrect password.');
    }

    const payload = { username: player.username, sub: player.id };
    const access_token = this.jwtService.sign(payload);

    return new PlayerResponseDto(player.id, player.username, access_token);
  }
}
