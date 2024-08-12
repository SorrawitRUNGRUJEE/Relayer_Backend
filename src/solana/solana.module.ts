import { Module } from '@nestjs/common';
import { SolanaService } from './solana.service';
import { SolanaController } from './solana.controller';

@Module({
  controllers: [SolanaController],
  providers: [SolanaService],
})
export class SolanaModule {}
