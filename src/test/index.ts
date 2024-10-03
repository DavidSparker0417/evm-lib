import * as dotenv from 'dotenv';
import { testWallet } from './wallet';
import { evmRpcInit } from '../endpoint';
import { evmWalletImport } from '../wallet';
import { testToken } from './token';
import { evmNetConfig } from '../constants';
import { testTransaction } from './transaction';
import { aaveTest } from './aave';
import { testTraderJoe } from './trader-joe';

dotenv.config()

evmRpcInit(evmNetConfig.rpc)

export const signer = evmWalletImport(process.env.PRIVATE_KEY!)
async function test() {
  // testWallet()
  // await testContract()
  // testToken()
  // await testTransaction()
  // await aaveTest()
  await testTraderJoe()
}

test()