import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../../repositories/player.repository';
import { Player } from '@prisma/client';
import { CreatePlayerDto } from '../../dtos/create-player.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async getPlayerById(id: number): Promise<Player> {
    return this.playerRepository.findPlayerById(id);
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.playerRepository.findAllPlayers();
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { username, password } = createPlayerDto;

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    return this.playerRepository.createPlayer(username, hashedPassword);
  }

  async deletePlayer(id: number): Promise<Player> {
    return this.playerRepository.deletePlayer(id);
  }
}
