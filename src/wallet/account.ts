import Web3 from "web3"
import { Web3Account } from '../types/index';
import { evmWeb3 } from "../endpoint";
const web3 = new Web3()

export function evmAddr(account: any): string {
  if (typeof account === "string")
    return account

  return account.address
}

export function evmAccount(account: string|Web3Account): Web3Account {
  if (typeof account === "string")
    return evmWalletImport(account)

  return account
}

export function evmWalletCreate(): any {
  const account = web3.eth.accounts.create()
  return account
}

export function evmWalletImport(privKey: string): Web3Account {
  const account = web3.eth.accounts.privateKeyToAccount(privKey)
  return account
}

export function evmAddrIsValid(addr: string): boolean {
  try {
    evmWeb3.utils.toChecksumAddress(addr) 
  } catch (error) {
    return false
  }
  return true
}
