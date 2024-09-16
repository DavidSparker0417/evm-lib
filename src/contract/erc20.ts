import { evmWeb3 } from "../endpoint"
import erc20Abi from "./abis/erc20.json"
import { TokenMeta, Web3Account } from '../types/index';
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

export async function evmErc20GetAllowance(tokenAddr: string, owner: string, spender: string): Promise<Numbers> {
  const contract = evmErc20Contract(tokenAddr)
  const allowAmount:any = await contract.methods.allowance(owner, spender).call()
  return allowAmount
}

export async function evmErc20IsAllowed(tokenAddr: string, owner: string, spender: string, amount: Numbers): Promise<boolean> {
  const allowedAmount = await evmErc20GetAllowance(tokenAddr, owner, spender)
  return allowedAmount >= amount
}

export async function evmErc20Approve(_signer: Web3Account|string, tokenAddr: string, spender: string, amount: Numbers) {
  const signer = evmAccount(_signer)
  const contract = evmErc20Contract(tokenAddr)
  if (await evmErc20IsAllowed(tokenAddr, signer.address, spender, amount)) {
    return ''
  }
  const data = contract.methods.approve(spender, amount).encodeABI()
  const txHash = await evmContractSendTransaction(signer, tokenAddr, data)
  console.log(`[DAVID](EVM-LIB) Erc20 token(${tokenAddr}) approved ${amount}, txHash: ${txHash}`)
  return txHash
}

export async function evmErc20GetMeta(addr: string): Promise<TokenMeta> {
  console.log(`[DAVID](EVM-LIB)(evmErc20GetMeta) addr :`, addr)
  const contract = evmErc20Contract(addr) 
  const name:any = await contract.methods.name().call()
  const decimals:any = await contract.methods.decimals().call()
  const symbol:any = await contract.methods.symbol().call()
  return {
    name, decimals, symbol
  }
}

export async function evmErc20Mint(_signer: string|Web3Account, tokenAddr: string, amount: Numbers, to:string|undefined): Promise<string> {
  const signer = evmAccount(_signer)
  const contract = evmErc20Contract(tokenAddr)

  const data = contract.methods.mint(
    to ? to : signer.address,
    amount
  ).encodeABI()

  return await evmContractSendTransaction(signer, tokenAddr, data)
}