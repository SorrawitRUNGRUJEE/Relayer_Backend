import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SolanaService } from './solana.service';
import { PublicKey } from '@solana/web3.js';

@Controller('solana')
export class SolanaController {
  constructor(private readonly solanaService: SolanaService) {}

  @Post('deposit')
  async depositRecord(
    @Body('accountPubkey') accountPubkey: string,
    @Body('amount') amount: number,
    @Body('description') description: string,
  ) {
    const pubkey = new PublicKey(accountPubkey);
    await this.solanaService.depositRecord(pubkey, amount, description);
    return { message: 'Deposit successful' };
  }

  @Post('delete')
  async deleteRecord(
    @Body('accountPubkey') accountPubkey: string,
    @Body('index') index: number,
  ) {
    const pubkey = new PublicKey(accountPubkey);
    await this.solanaService.deleteRecord(pubkey, index);
    return { message: 'Record deleted successfully' };
  }

  @Get('deposits/:accountPubkey')
  async getCurrentDeposits(@Param('accountPubkey') accountPubkey: string) {
    const pubkey = new PublicKey(accountPubkey);
    const deposits = await this.solanaService.getCurrentDeposits(pubkey);
    return deposits;
  }
}
