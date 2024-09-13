import * as dotenv from 'dotenv';
import { testWallet } from './wallet';
import { evmRpcInit } from '../endpoint';
import { evmWalletImport } from '../wallet';
import { testContract } from './contract';
import { testToken } from './token';
import { globalConfig } from './config';

export const network = 'sei_mainnet' //"sei_devnet"
export const curConfig = globalConfig[network]
dotenv.config()

evmRpcInit(curConfig.rpc)

export const signer = evmWalletImport(process.env.PRIVATE_KEY!)
async function test() {
  // testWallet()
  await testContract()
  // testToken()
}

test()