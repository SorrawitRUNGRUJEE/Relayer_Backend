import { Module } from '@nestjs/common';
import { DepositService } from './relayer.service';
import { DepositController } from './relayer.controller';
import { DepositCheckerService } from './relayer_checker.service';

@Module({
  controllers: [DepositController],
  providers: [DepositService, DepositCheckerService],
})
export class RelayerModule {}
