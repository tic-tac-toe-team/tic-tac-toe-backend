import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { BoardService } from '../../services/board/board.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CellResponseDto } from '../../dtos/cell-response.dto';
import { PlayerGameResponseDto } from '../../dtos/player-game-response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('all')
  async getAllGames(): Promise<any[]> {
    return this.boardService.getAllGames();
  }


  @Post('create/:playerId')
  async createGame(@Param('playerId', ParseIntPipe) playerId: number): Promise<PlayerGameResponseDto> {
    return await this.boardService.createGame(playerId);
  }

  @Post('join/:gameId/:playerId')
  async joinGame(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
  ): Promise<PlayerGameResponseDto> {
    return await this.boardService.joinGame(gameId, playerId);
  }

  @Post('leave/:gameId/:playerId')
  async leaveGame(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
  ): Promise<{ message: string }> {
    return await this.boardService.leaveGame(gameId, playerId);
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

  @Get(':gameId')
  async getGameBoard(@Param('gameId', ParseIntPipe) gameId: number): Promise<CellResponseDto[]> {
    return await this.boardService.getGameBoard(gameId);
  }

  @Get(':gameId/state')
  async getGameState(@Param('gameId', ParseIntPipe) gameId: number): Promise<any> {
    return this.boardService.getGameState(gameId);
  }
}
