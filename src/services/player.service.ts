import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';
import { Player } from '@prisma/client';
import { CreatePlayerRequestDto } from '../dtos/create-player-request.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async getById(id: number): Promise<Player> {
    return this.playerRepository.findById(id);
  }

  async getByUsername(username: string): Promise<Player> {
    return this.playerRepository.findByUsername(username);
  }

  async getAll(): Promise<Player[]> {
    return this.playerRepository.findAll();
  }

  async create(createPlayerDto: CreatePlayerRequestDto): Promise<Player> {
    const { username, password } = createPlayerDto;

    return this.playerRepository.create(username, password);
  }

  async delete(id: number): Promise<Player> {
    return this.playerRepository.delete(id);
  }
}
