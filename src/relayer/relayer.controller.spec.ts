import { Test, TestingModule } from '@nestjs/testing';
import { RelayerController } from './relayer.controller';
import { RelayerService } from './relayer.service';

describe('RelayerController', () => {
  let controller: RelayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelayerController],
      providers: [RelayerService],
    }).compile();

    controller = module.get<RelayerController>(RelayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
