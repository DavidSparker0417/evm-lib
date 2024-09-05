import { evmWeb3 } from "../endpoint"
import erc20Abi from "./abis/erc20.json"
import { Web3Account } from '../types/index';
import { evmAccount } from "../wallet";
import { Numbers } from "web3";
import { evmContractSendTransaction } from "./common";

export interface ERC20Details {
  name: string,
  symbol: string,
  decimals: number
  logo?: string,
  desc?: string,
  twitter?:string,
  telegram?:string,
  website?:string
}

export function evmErc20Contract(contractAddr: string) {
  const contract = new evmWeb3.eth.Contract(erc20Abi, contractAddr)
  return contract
}

export async function evmErc20Approve(_signer: Web3Account|string, tokenAddr: string, spender: string, amount: Numbers) {
  const signer = evmAccount(_signer)
  const contract = evmErc20Contract(tokenAddr)
  const data = contract.methods.approve(spender, amount).encodeABI()
  const txHash = await evmContractSendTransaction(signer, tokenAddr, data)
  console.log(`[DAVID](EVM-LIB) Erc20 token(${tokenAddr}) approved ${amount}, txHash: ${txHash}`)
  return txHash
}