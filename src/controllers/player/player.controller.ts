import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../../services/player/player.service';
import { Player } from '@prisma/client';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { PlayerResponseDto } from '../../dtos/player-response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('player')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id')
  public async getById(@Param('id', ParseIntPipe) id: number): Promise<PlayerResponseDto> {
    const player = await this.playerService.getById(id);

    return new PlayerResponseDto(player.id, player.username);
  }

  @Get()
  public async getAll(): Promise<PlayerResponseDto[]> {
    const players = await this.playerService.getAll();

    return players.map(player => new PlayerResponseDto(player.id, player.username));
  }
}

