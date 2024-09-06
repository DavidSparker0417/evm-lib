import { Numbers } from "web3";
import { evmTrJoeLBContract } from ".";
import { evmContractSendTransaction } from "../../contract/common";
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import { JoePath, LiquidityParam, RemoveLiquidityParam } from "./types";

export async function evmTrJoeAddLiquidity(_sender: Web3Account|string, router: string, param: LiquidityParam): Promise<string> {
  const sender = evmAccount(_sender)
  const contract = evmTrJoeLBContract(router)
  const txData = contract.methods.addLiquidity(param).encodeABI();
  return await evmContractSendTransaction(sender, router, txData)
}

export async function evmTrJoeRemoveLiquidity(_sender: Web3Account|string, router: string, param: RemoveLiquidityParam): Promise<string> {
  const sender = evmAccount(_sender)
  const contract = evmTrJoeLBContract(router)
  const txData = contract.methods.removeLiquidity(param.tokenX, param.tokenY, param.binStep, param.amountXMin, param.amountYMin, param.ids, param.amounts, param.to, param.deadline).encodeABI();
  return await evmContractSendTransaction(sender, router, txData)
}

export async function evmTrJoeSwapExactTokensForTokens(
  _trader: Web3Account|string, 
  router: string,
  amountIn: Numbers,
  amountOutMin: Numbers,
  tokenPath: JoePath,
  to: string,
  deadline: number = 0
): Promise<string> {
  const trader = evmAccount(_trader)
  const contract = evmTrJoeLBContract(router)

  const txData = contract.methods.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    tokenPath,
    to,
    deadline ? deadline : ((new Date()).getTime() / 1000) + 3600
  ).encodeABI()
  return await evmContractSendTransaction(trader, router, txData)
}