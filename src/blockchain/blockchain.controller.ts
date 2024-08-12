import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  private readonly logger = new Logger(BlockchainController.name);

  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('greeting')
  async getGreeting(): Promise<string> {
    return await this.blockchainService.getGreeting();
  }

  @Post('set-name')
  async setName(@Body('name') name: string): Promise<void> {
    this.logger.log(`Received setName request with name: ${name}`);
    await this.blockchainService.setName(name);
    this.logger.log('setName request processed successfully');
  }

  @Get('name')
  async getName(): Promise<string> {
    return await this.blockchainService.getName();
  }
}
