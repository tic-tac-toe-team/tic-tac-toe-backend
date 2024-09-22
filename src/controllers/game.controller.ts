import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { GameService } from '../services/game.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MakeMoveRequestDto } from '../dtos/make-move-request.dto';
import { JoinPlayerRequestDto } from '../dtos/join-player-request.dto';
import { LeaveGameRequestDto } from '../dtos/leave-game-request.dto';
import { GameResponseDto } from '../dtos/game-response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('game')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getAll(): Promise<GameResponseDto[]> {
    return await this.gameService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<GameResponseDto> {
    return await this.gameService.getById(id);
  }

  @Get(':id/state')
  async getState(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.gameService.getState(id);
  }

  @Post()
  async create(@Body() joinPlayerRequestDto: JoinPlayerRequestDto): Promise<GameResponseDto> {
    return await this.gameService.create(joinPlayerRequestDto.playerId);
  }

  @Post(':id/join')
  async joinPlayer(
    @Param('id', ParseIntPipe) gameId: number,
    @Body() joinPlayerRequestDto: JoinPlayerRequestDto,
  ): Promise<GameResponseDto> {
    return await this.gameService.joinPlayer(gameId, joinPlayerRequestDto.playerId);
  }

  @Post(':id/leave')
  async leaveGame(
    @Param('id', ParseIntPipe) gameId: number,
    @Body() leaveGameRequestDto: LeaveGameRequestDto,
  ): Promise<void> {
    return await this.gameService.leaveGame(gameId, leaveGameRequestDto.playerId);
  }

  @Post(':id/move')
  async makeMove(
    @Param('id', ParseIntPipe) id: number,
    @Body() makeMoveDto: MakeMoveRequestDto,
  ): Promise<GameResponseDto> {
    const { position, playerId } = makeMoveDto;

    return await this.gameService.makeMove(id, playerId, position);
  }

  @Post(':id/restart')
  async resetGame(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.gameService.resetGame(id);
  }
}
