import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BoardService } from '../../services/board/board.service';
import { Player } from '@prisma/client';
import { CreateGameResponseDto } from '../../dtos/create-game-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('create')
  async createNewGame(@Body('players') players: Player[]): Promise<CreateGameResponseDto> {
    return this.boardService.createGame(players);
  }

  @Post(':gameId/move')
  async makeMove(
    @Param('gameId') gameId: number,
    @Body('position') position: number,
  ): Promise<void> {
    await this.boardService.makeMove(gameId, position);
  }

  @Post(':gameId/restart')
  async resetGame(@Param('gameId') gameId: number): Promise<void> {
    await this.boardService.resetGame(gameId);
  }

  @Get(':gameId')
  async getGameBoard(@Param('gameId') gameId: number): Promise<any[]> {
    return this.boardService.getGameBoard(gameId);
  }

  @Get(':gameId/state')
  async getGameState(@Param('gameId') gameId: number): Promise<any> {
    return this.boardService.getGameState(gameId);
  }
}
