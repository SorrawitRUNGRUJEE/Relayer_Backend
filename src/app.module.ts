import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { RelayerModule } from './relayer/relayer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SolanaModule } from './solana/solana.module';

@Module({
  imports: [
    BlockchainModule,
    RelayerModule,
    ScheduleModule.forRoot(),
    SolanaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
