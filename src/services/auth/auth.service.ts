import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { CreatePlayerRequestDto } from '../../dtos/create-player-request.dto';
import { LoginRequestDto } from '../../dtos/login-request.dto';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../crypto.service';
import { LoginResponseDto } from '../../dtos/login-response.dto';
import { CreatePlayerResponseDto } from '../../dtos/create-player-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  async register(createPlayerDto: CreatePlayerRequestDto): Promise<CreatePlayerResponseDto> {
    const existingPlayer = await this.playerService.getByUsername(createPlayerDto.username);

    if (existingPlayer) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await this.cryptoService.hashPassword(createPlayerDto.password);

    const player = await this.playerService.create({
      username: createPlayerDto.username,
      password: hashedPassword,
    });

    return {
      id: player.id,
      username: player.username,
    };
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

    return {
      id: player.id,
      username: player.username,
      access_token: access_token,
    };
  }
}
