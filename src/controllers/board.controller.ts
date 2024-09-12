import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { BoardService } from '../services/board.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CellResponseDto } from '../dtos/cell-response.dto';
import { JoinPlayerRequestDto } from '../dtos/join-player-request.dto';
import { LeaveGameRequestDto } from '../dtos/leave-game-request.dto';
import { BoardResponseDto } from '../dtos/board-response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('board')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('all')
  async getAllGames(): Promise<any[]> {
    return this.boardService.getAllGames();
  }

  @Get(':gameId')
  async getGameBoard(@Param('gameId', ParseIntPipe) gameId: number): Promise<CellResponseDto[]> {
    return await this.boardService.getGameBoard(gameId);
  }

  @Get(':gameId/state')
  async getGameState(@Param('gameId', ParseIntPipe) gameId: number): Promise<any> {
    return this.boardService.getGameState(gameId);
  }

  @Post()
  async create(@Body() joinPlayerRequestDto: JoinPlayerRequestDto): Promise<BoardResponseDto> {
    return await this.boardService.create(joinPlayerRequestDto.playerId);
  }

  @Post(':id/join')
  async joinPlayer(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() joinPlayerRequestDto: JoinPlayerRequestDto,
  ): Promise<BoardResponseDto> {
    return await this.boardService.joinPlayer(boardId, joinPlayerRequestDto.playerId);
  }

  @Post(':id/leave')
  async leaveGame(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() leaveGameRequestDto: LeaveGameRequestDto,
  ): Promise<void> {
    return await this.boardService.leaveGame(boardId, leaveGameRequestDto.playerId);
  }

  @Post(':gameId/:position/move')
  async makeMove(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('position', ParseIntPipe) position: number,
  ): Promise<void> {
    await this.boardService.makeMove(gameId, position);
  }

  @Post(':gameId/restart')
  async resetGame(@Param('gameId', ParseIntPipe) gameId: number): Promise<{ message: string }> {
    const message = await this.boardService.resetGame(gameId);

    return { message };
  }
}
