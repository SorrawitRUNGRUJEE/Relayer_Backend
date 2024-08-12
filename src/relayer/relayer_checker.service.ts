import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { DepositService } from './relayer.service';

@Injectable()
export class DepositCheckerService {
  private readonly logger = new Logger(DepositCheckerService.name);

  constructor(private readonly depositService: DepositService) {}

  @Interval(5000) // This will run every 5 seconds
  async checkForNewDeposits() {
    try {
      const deposits = await this.depositService.getAllDeposits();
      this.logger.log(`Checked deposits: ${JSON.stringify(deposits)}`);
      // Add your logic here to handle new deposits
      // For example, you can compare with previous state and log new deposits
    } catch (error) {
      this.logger.error(`Error checking deposits: ${error.message}`);
    }
  }
}
