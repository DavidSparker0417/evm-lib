import { evmWeb3 } from "../endpoint"
import trPairAbi from "./abis/trPair.json"
import { Web3Account } from '../types/index';
import { evmAccount } from "../wallet";
import { evmContractSendTransaction } from "./common";

export function evmtrPairContract(contractAddr: string) {
  const contract = new evmWeb3.eth.Contract(trPairAbi, contractAddr)
  return contract
}

export async function evmtrPairApproveAll(_signer: Web3Account|string, pairAddr: string, spender: string) {
  const signer = evmAccount(_signer)
  const contract = evmtrPairContract(pairAddr)
  const data = contract.methods.approveForAll(spender, true).encodeABI()
  const txHash = await evmContractSendTransaction(signer, pairAddr, data)
  console.log(`[DAVID](EVM-LIB) Pair (${pairAddr}) approved all, txHash: ${txHash}`)
  return txHash
}