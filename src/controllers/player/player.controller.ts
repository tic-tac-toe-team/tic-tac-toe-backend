import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../../services/player/player.service';
import { Player } from '@prisma/client';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('player')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id')
  public async getById(@Param('id', ParseIntPipe) id: number): Promise<Player> {
    return this.playerService.getById(id);
  }

  @Get()
  public async getAll(): Promise<Player[]> {
    return this.playerService.getAll();
  }
}
