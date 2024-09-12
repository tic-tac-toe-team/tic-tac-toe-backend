import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { BoardService } from '../services/board.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CellResponseDto } from '../dtos/cell-response.dto';
import { MakeMoveDto } from '../dtos/make-move.dto';
import { JoinPlayerRequestDto } from '../dtos/join-player-request.dto';
import { LeaveGameRequestDto } from '../dtos/leave-game-request.dto';
import { BoardResponseDto } from '../dtos/board-response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('board')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async getAllGames(): Promise<any[]> {
    return this.boardService.getAllGames();
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
