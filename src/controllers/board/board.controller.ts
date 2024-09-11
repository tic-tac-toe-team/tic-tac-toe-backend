import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BoardService } from '../../services/board/board.service';
import { Player } from '@prisma/client';
import { CreateGameResponseDto } from '../../dtos/create-game-response.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateGameDto } from '../../dtos/create-game-request.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('create')
  @ApiBody({ type: CreateGameDto })
  async createNewGame(@Body() createGameDto: CreateGameDto): Promise<CreateGameResponseDto> {
    return this.boardService.createGame(createGameDto.playerOneId, createGameDto.playerTwoId);
  }

  @Get('all')
  async getAllGames(): Promise<any[]> {
    return this.boardService.getAllGames();
  }

  @Post(':gameId/position/move')
  async makeMove(
    @Param('gameId') gameId: string,
    @Param('position') position: string,
  ): Promise<void> {
    const parsedGameId = parseInt(gameId, 10);
    const parsedPosition = parseInt(position, 10);

    await this.boardService.makeMove(parsedGameId, parsedPosition);
  }

  @Post(':gameId/restart')
  async resetGame(@Param('gameId') gameId: number): Promise<void> {
    await this.boardService.resetGame(gameId);
  }

  @Get(':gameId')
  async getGameBoard(@Param('gameId') gameId: string): Promise<any[]> {
    return this.boardService.getGameBoard(parseInt(gameId, 10));
  }

  @Get(':gameId/state')
  async getGameState(@Param('gameId') gameId: string): Promise<any> {
    return this.boardService.getGameState(parseInt(gameId, 10));
  }
}
