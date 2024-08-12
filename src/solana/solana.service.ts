import { Injectable, Logger } from '@nestjs/common';
import {
  Connection,
  PublicKey,
  TransactionInstruction,
  Transaction,
  Keypair,
} from '@solana/web3.js';
import * as borsh from 'borsh';

const PROGRAM_ID = new PublicKey(process.env.SOLANA_RELAYER_PROGRAM_ID); // Replace with your actual program ID
const GLOBAL_STATE_PUBLIC_KEY = new PublicKey(
  'your-global-state-account-public-key-here',
); // Replace with your actual global state account public key

// Borsh schema
class DepositRecord {
  amount: bigint;
  description: string;

  constructor(fields: { amount: bigint; description: string }) {
    this.amount = fields.amount;
    this.description = fields.description;
  }
}

class GlobalState {
  records: DepositRecord[];

  constructor(fields: { records: DepositRecord[] }) {
    this.records = fields.records;
  }
}

const DepositRecordSchema = new Map([
  [
    DepositRecord,
    {
      kind: 'struct',
      fields: [
        ['amount', 'u64'],
        ['description', 'string'],
      ],
    },
  ],
]);

const GlobalStateSchema = new Map([
  [GlobalState, { kind: 'struct', fields: [['records', [DepositRecord]]] }],
]);

@Injectable()
export class SolanaProgramService {
  private readonly logger = new Logger(SolanaProgramService.name);
  private readonly connection = new Connection(
    'https://api.mainnet-beta.solana.com',
  ); // Change if using a different network

  async deposit(amount: bigint, description: string, payer: Keypair) {
    const instructionData = Buffer.concat([
      Buffer.from([0]), // Deposit instruction identifier
      Buffer.from(amount.toArray('le', 8)),
      Buffer.from(description.length.toString(16).padStart(16, '0'), 'hex'),
      Buffer.from(description),
    ]);

    await this.sendTransaction(instructionData, payer);
  }

  async deleteRecord(index: number, payer: Keypair) {
    const instructionData = Buffer.concat([
      Buffer.from([1]), // Delete record instruction identifier
      Buffer.from(index.toString(16).padStart(16, '0'), 'hex'),
    ]);

    await this.sendTransaction(instructionData, payer);
  }

  async getCurrentDeposits() {
    const instructionData = Buffer.from([2]); // Get current deposits instruction identifier
    const accounts = await this.getProgramAccounts();

    const globalStateData =
      accounts[GLOBAL_STATE_PUBLIC_KEY.toBase58()].account.data;
    const globalState = borsh.deserialize(
      GlobalStateSchema,
      GlobalState,
      globalStateData,
    );

    return globalState.records;
  }

  private async sendTransaction(instructionData: Buffer, payer: Keypair) {
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: GLOBAL_STATE_PUBLIC_KEY, isSigner: false, isWritable: true },
      ],
      programId: PROGRAM_ID,
      data: instructionData,
    });

    const transaction = new Transaction().add(instruction);
    await this.connection.sendTransaction(transaction, [payer]);
  }

  private async getProgramAccounts() {
    const accounts = await this.connection.getParsedProgramAccounts(PROGRAM_ID);
    return accounts.reduce((acc, account) => {
      acc[account.pubkey.toBase58()] = account;
      return acc;
    }, {});
  }
}
