import { Numbers } from "web3";
import { evmTrJoeLBContract } from ".";
import { evmContractSendTransaction } from "../../contract/common";
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import { LiquidityParam } from "./types";

export async function evmTrJoeAddLiquidity(_sender: Web3Account|string, router: string, param: LiquidityParam): Promise<string> {
  const sender = evmAccount(_sender)
  const contract = evmTrJoeLBContract(router)
  const txData = contract.methods.addLiquidity(param).encodeABI();
  return await evmContractSendTransaction(sender, router, txData)
}

export async function evmTrJoeSwapExactTokensForTokens(
  _sender: Web3Account|string, 
  router: string,
  amountIn: Numbers,
  amountOutMin: Numbers
): Promise<string> {
  const sender = evmAccount(_sender)
  const contract = evmTrJoeLBContract(router)

  const txData = contract.methods.swapExactTokensForTokens(
    amountIn,

  ).encodeABI()
  return ''
}