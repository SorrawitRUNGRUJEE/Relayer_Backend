import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { DepositService } from './relayer.service';

@Controller('deposits')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post('make')
  async makeDeposit(
    @Body('address') address: string,
    @Body('value') value: string,
    @Body('from') from: string,
  ) {
    const tx = await this.depositService.makeDeposit(address, value);
    return tx;
  }

  @Post('delete')
  async deleteDeposit(@Body('from') from: string) {
    const tx = await this.depositService.deleteDeposit();
    return tx;
  }

  @Post('transfer')
  async transferETH(@Body('to') to: string, @Body('amount') amount: string) {
    const tx = await this.depositService.transferETH(to, amount);
    return tx;
  }

  @Post('withdraw-all')
  async withdrawAllDeposits(@Body('from') from: string) {
    const tx = await this.depositService.withdrawAllDeposits();
    return tx;
  }

  @Get('all')
  async getAllDeposits() {
    const deposits = await this.depositService.getAllDeposits();
    return deposits;
  }

  @Get(':user')
  async getDeposit(@Param('user') user: string) {
    const deposit = await this.depositService.getDeposit(user);
    return deposit;
  }

  @Get('depositor/:index')
  async getDepositors(@Param('index') index: number) {
    const depositor = await this.depositService.getDepositors(index);
    return depositor;
  }

  @Get('user/:user')
  async getDeposits(@Param('user') user: string) {
    const deposit = await this.depositService.getDeposits(user);
    return deposit;
  }
}
