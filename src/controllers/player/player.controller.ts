import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from '../../services/player/player.service';
import { Player } from '@prisma/client';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id')
  public async getPlayerById(@Param('id') id: number): Promise<Player> {
    return this.playerService.getPlayerById(id);
  }

  @Get()
  public async getAllPlayers(): Promise<Player[]> {
    return this.playerService.getAllPlayers();
  }
}
