import { Test, TestingModule } from '@nestjs/testing';
import { PlayerGameService } from './player-game.service';

describe('PlayerGameService', () => {
  let service: PlayerGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerGameService],
    }).compile();

    service = module.get<PlayerGameService>(PlayerGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
