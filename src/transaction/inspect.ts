import { Numbers } from "web3";
import { evmWeb3 } from "../endpoint";
import { evmNetConfig } from "../constants";

export async function evmTrGetGasUsed(trHash: string): Promise<Numbers> {
  const trReceipt = await evmWeb3.eth.getTransactionReceipt(trHash)
  let gasUsed = trReceipt.gasUsed
  const gasPrice = trReceipt.effectiveGasPrice || BigInt(1)
  return gasUsed * gasPrice
}

export async function evmTrGetConsumedGas(trHashList: string[]): Promise<number> {
  let consumed = BigInt(0)
  for(const trHash of trHashList) {
    const gasUsed = await evmTrGetGasUsed(trHash)
    consumed += BigInt(gasUsed.toString())
  }
  return Number(evmWeb3.utils.fromWei(consumed, 'ether'))
}