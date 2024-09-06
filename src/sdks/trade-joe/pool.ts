import { evmTrJoeLBContract } from ".";
import { evmContractSendTransaction } from "../../contract/common";
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import { LiquidityParam } from "./types";

export async function evmTrJoeAddLiquidity(_sender: Web3Account|string, lbAddr: string, param: LiquidityParam): Promise<any> {
  const sender = evmAccount(_sender)
  
  const contract = evmTrJoeLBContract(lbAddr)
  
  // Create the transaction data
  const txData = contract.methods.addLiquidity(param).encodeABI();
  return await evmContractSendTransaction(sender, lbAddr, txData)
}