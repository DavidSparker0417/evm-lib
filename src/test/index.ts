import * as dotenv from 'dotenv';
import { testWallet } from './wallet';
import { evmRpcInit } from '../endpoint';
import { evmWalletImport } from '../wallet';
import { testContract } from './contract';
import { testToken } from './token';

dotenv.config()
evmRpcInit(process.env.RPC_URL!)

export const signer = evmWalletImport(process.env.PRIVATE_KEY!)
async function test() {
  // testWallet()
  testContract()
  // testToken()
}

test()