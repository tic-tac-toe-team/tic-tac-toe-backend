import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../../repositories/player.repository';
import { Player } from '@prisma/client';
import { CreatePlayerDto } from '../../dtos/create-player.dto';
import * as bcrypt from 'bcrypt';

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

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { username, password } = createPlayerDto;

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    return this.playerRepository.create(username, hashedPassword);
  }

  async delete(id: number): Promise<Player> {
    return this.playerRepository.delete(id);
  }
}
