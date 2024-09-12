import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { BoardService } from '../services/board.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CellResponseDto } from '../dtos/cell-response.dto';
import { PlayerGameResponseDto } from '../dtos/player-game-response.dto';
import { MakeMoveDto } from '../dtos/make-move.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
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

  @Post(':id/move')
  async makeMove(
    @Param('id', ParseIntPipe) id: number,
    @Body() makeMoveDto: MakeMoveDto,
  ): Promise<CellResponseDto[]> {
    const { position } = makeMoveDto;

    return await this.boardService.makeMove(id, position);
  }

  @Post(':id/restart')
  async resetGame(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    const message = await this.boardService.resetGame(id);

    return { message };
  }

  @Get(':id')
  async getGameBoard(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
    return await this.boardService.getGameBoard(id);
  }

  @Get(':id/state')
  async getGameState(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.boardService.getGameState(id);
  }
}
