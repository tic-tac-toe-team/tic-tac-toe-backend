import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { CreatePlayerDto } from '../../dtos/create-player.dto';
import { LoginRequestDto } from '../../dtos/login-request.dto';
import { Player } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../crypto.service';
import { LoginResponseDto } from '../../dtos/login-response.dto';

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

  async login(loginPlayerDto: LoginRequestDto): Promise<LoginResponseDto> {
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

    return new LoginResponseDto(player.id, player.username, access_token);
  }
}
