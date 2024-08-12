import { Injectable, Logger } from '@nestjs/common';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';

const abi = [
  {
    inputs: [],
    name: 'deleteDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'DepositDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'associatedAddress',
        type: 'address',
      },
    ],
    name: 'DepositMade',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_associatedAddress',
        type: 'address',
      },
    ],
    name: 'makeDeposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'transferETH',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'withdrawAllDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'depositors',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'deposits',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'associatedAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllDeposits',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'associatedAddress',
            type: 'address',
          },
        ],
        internalType: 'struct DepositRecorder.Deposit[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getDeposit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'associatedAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const contractAddress = '0x2118B02a50180e7355a6B3018d2CBe7343b77974';

@Injectable()
export class DepositService {
  private readonly logger = new Logger(DepositService.name);
  private provider: JsonRpcProvider;
  private wallet: Wallet;
  private contract: Contract;

  constructor() {
    this.provider = new JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.wallet = new Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new Contract(contractAddress, abi, this.wallet);
  }

  async makeDeposit(_associatedAddress: string, value: string): Promise<any> {
    try {
      function parseEther(etherValue: string): string {
        const [whole, fraction = ''] = etherValue.split('.');
        const weiValue = whole + fraction.padEnd(18, '0');
        return weiValue;
      }

      const weiValue = parseEther(value);
      const tx = await this.contract.makeDeposit(_associatedAddress, {
        value: weiValue,
      });
      await tx.wait();
      this.logger.log(
        `Deposit made by ${_associatedAddress} with value ${value}`,
      );
      return tx;
    } catch (error) {
      this.logger.error(`Error making deposit: ${error.message}`);
      throw error;
    }
  }

  async deleteDeposit(): Promise<any> {
    try {
      const tx = await this.contract.deleteDeposit();
      await tx.wait();
      this.logger.log(`Deposit deleted`);
      return tx;
    } catch (error) {
      this.logger.error(`Error deleting deposit: ${error.message}`);
      throw error;
    }
  }

  async transferETH(_to: string, _amount: string): Promise<any> {
    function parseEther(etherValue: string): string {
      if (!etherValue) {
        throw new Error('Invalid ether value');
      }

      const [whole, fraction = ''] = etherValue.split('.');
      if (fraction.length > 18) {
        throw new Error('Ether value has too many decimal places');
      }

      const weiValue = whole + fraction.padEnd(18, '0');
      return BigInt(weiValue).toString(); // Convert to BigInt for large number handling
    }

    const weiValue = parseEther(_amount);

    try {
      const tx = await this.contract.transferETH(_to, weiValue);
      await tx.wait();
      this.logger.log(`Transferred ${_amount} ETH to ${_to}`);
      return tx;
    } catch (error) {
      this.logger.error(`Error transferring ETH: ${error.message}`);
      throw error;
    }
  }

  async withdrawAllDeposits(): Promise<any> {
    try {
      const tx = await this.contract.withdrawAllDeposits();
      await tx.wait();
      this.logger.log(`All deposits withdrawn`);
      return tx;
    } catch (error) {
      this.logger.error(`Error withdrawing all deposits: ${error.message}`);
      throw error;
    }
  }

  async getAllDeposits(): Promise<any[]> {
    try {
      const deposits = await this.contract.getAllDeposits();
      this.logger.log(`Fetched all deposits`);
      return deposits.map((deposit: any) => ({
        amount: deposit.amount.toString(),
        timestamp: deposit.timestamp.toString(),
        associatedAddress: deposit.associatedAddress,
      }));
    } catch (error) {
      this.logger.error(`Error fetching all deposits: ${error.message}`);
      throw error;
    }
  }

  async getDeposit(user: string): Promise<any> {
    try {
      const deposit = await this.contract.getDeposit(user);
      this.logger.log(`Fetched deposit for user ${user}`);
      return {
        ...deposit,
        amount: deposit.amount.toString(),
        timestamp: deposit.timestamp.toString(),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching deposit for user ${user}: ${error.message}`,
      );
      throw error;
    }
  }

  async getDepositors(index: number): Promise<string> {
    try {
      const depositor = await this.contract.depositors(index);
      this.logger.log(`Fetched depositor at index ${index}`);
      return depositor;
    } catch (error) {
      this.logger.error(
        `Error fetching depositor at index ${index}: ${error.message}`,
      );
      throw error;
    }
  }

  async getDeposits(user: string): Promise<any> {
    try {
      const deposit = await this.contract.deposits(user);
      this.logger.log(`Fetched deposits for user ${user}`);
      return {
        ...deposit,
        amount: deposit.amount.toString(),
        timestamp: deposit.timestamp.toString(),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching deposits for user ${user}: ${error.message}`,
      );
      throw error;
    }
  }
}
