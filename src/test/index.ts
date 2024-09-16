import * as dotenv from 'dotenv';
import { testWallet } from './wallet';
import { evmRpcInit } from '../endpoint';
import { evmWalletImport } from '../wallet';
import { testContract } from './contract';
import { testToken } from './token';
import { evmNetConfig } from '../constants';

dotenv.config()

evmRpcInit(evmNetConfig.rpc)

export const signer = evmWalletImport(process.env.PRIVATE_KEY!)
async function test() {
  // testWallet()
  await testContract()
  // testToken()
}

test()