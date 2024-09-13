import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { GameService } from '../services/game.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CellResponseDto } from '../dtos/cell-response.dto';
import { MakeMoveDto } from '../dtos/make-move.dto';
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
  async getAllGames(): Promise<GameResponseDto[]> {
    return await this.gameService.getAllGames();
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
    @Body() makeMoveDto: MakeMoveDto,
  ): Promise<CellResponseDto[]> {
    const { position } = makeMoveDto;

    return await this.gameService.makeMove(id, position);
  }

  @Post(':id/restart')
  async resetGame(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    const message = await this.gameService.resetGame(id);

    return { message };
  }

  @Get(':id')
  async getGameById(@Param('id', ParseIntPipe) id: number): Promise<GameResponseDto> {
    return await this.gameService.getGameById(id);
  }

  @Get(':id/state')
  async getGameState(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.gameService.getGameState(id);
  }
}
