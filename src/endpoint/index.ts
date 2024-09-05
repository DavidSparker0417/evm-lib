import * as dotenv from "dotenv"
import Web3 from "web3"

dotenv.config()

export let evmWeb3:Web3

if (process.env.PRC_URL)
  evmRpcInit(process.env.PRC_URL)

export function evmRpcInit(rpcUrl: string) {
  evmWeb3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
}