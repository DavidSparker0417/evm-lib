import { Transaction } from "web3"
import { evmWeb3 } from "../endpoint"
import { Web3Account } from "../types"
import { evmWalletImport } from "./account"
import { evmTrBuildTransferNative, evmTrSendTransaction } from "../transaction"

export async function evmWalletTransferNative(_sender: Web3Account|string, receiver: string, amount: number|undefined = undefined): Promise<string> {
  const sender: Web3Account = typeof _sender === "string" ? evmWalletImport(_sender) : _sender

  const tx:Transaction|undefined = await evmTrBuildTransferNative(sender.address, receiver, amount)
  if (!tx)
    return ''
  const txHash = await evmTrSendTransaction(sender, tx)
  console.log(`[DAVID](EVM-LIB)(evmWalletTransferNative) txHash =`, txHash)
  return txHash
}
