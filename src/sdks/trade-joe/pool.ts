import { Numbers } from "web3";
import { evmTrJoeFactoryGetPairInfo, evmTrJoeFactoryGetPairs, evmTrJoeLBContract } from ".";
import { evmContractSendTransaction } from "../../contract/common";
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import { JoePath, LiquidityParam, PairInfo, RemoveLiquidityParam } from "./types";
import { evmNetConfig } from "../../constants";
import { EvmContract } from "../../contract";
import { evmWeb3 } from "../../endpoint";
import abi from "./abis/LBRouter.json"
import { TrJoeLBPair } from "./lbPair";

export class TrJoeRouter extends EvmContract {
  constructor(address: string, signer: Web3Account | string) {
    super(address, signer)
    this.contract = new evmWeb3.eth.Contract(abi, address)
  }

  async addLiquidity(param: LiquidityParam): Promise<string> {
    let txData: any
    const pairInfo = await this.getPairInfo(param.tokenX, param.tokenY, param.binStep)
    const pair = new TrJoeLBPair(pairInfo.address, this.signer)
    if (param.tokenX === evmNetConfig.wNative || param.tokenY === evmNetConfig.wNative) {
      txData = this.contract.methods.addLiquidityNATIVE(param).encodeABI();
      const value = param.tokenX === evmNetConfig.wNative ? param.amountX : param.amountY
      return await evmContractSendTransaction(this.signer, this.address, txData, value)
    }

    txData = this.contract.methods.addLiquidity(param).encodeABI();
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async removeLiquidity(param: LiquidityParam): Promise<string> {
    const txData = this.contract.methods.removeLiquidity(param).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async swapExactNATIVEForTokens(
    amountInNative: Numbers,
    amountOutMin: Numbers,
    tokenPath: JoePath,
    to: string,
    deadline: number = 0
  ): Promise<string> {
    const txData = this.contract.methods.swapExactNATIVEForTokens(
      amountOutMin,
      tokenPath,
      to,
      deadline ? deadline : Math.floor((new Date()).getTime() / 1000) + 3600
    ).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData, amountInNative)
  }

  async swapExactTokensForNATIVE(
    amountInToken: Numbers,
    amountOutMinNative: Numbers,
    tokenPath: JoePath,
    to: string,
    deadline: number = 0
  ): Promise<string> {
    const txData = this.contract.methods.swapExactTokensForNATIVE(
      amountInToken,
      amountOutMinNative,
      tokenPath,
      to,
      deadline ? deadline : Math.floor((new Date()).getTime() / 1000) + 3600
    ).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async swapExactTokensForTokens(
    amountIn: Numbers,
    amountOutMin: Numbers,
    tokenPath: JoePath,
    to: string,
    deadline: number = 0
  ): Promise<string> {
    const txData = this.contract.methods.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      tokenPath,
      to,
      deadline ? deadline : Math.floor((new Date()).getTime() / 1000) + 3600
    ).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async getFactory(): Promise<string> {
    return await this.contract.methods.getFactory().call()
  }
  
  async getPairs(tokenX: string, tokenY: string): Promise<any[]> {
    const factory: string = await this.getFactory()
    const pairs: any = await evmTrJoeFactoryGetPairs(factory, tokenX, tokenY)
    return pairs.map((pair: any) => ({
      address: pair.LBPair,
      binStep: Number(pair.binStep)
    }))
  }
  
  async getPairInfo(tokenX: string, tokenY: string, binStep: Numbers): Promise<PairInfo> {
    const factory: string = await this.getFactory()
    return await evmTrJoeFactoryGetPairInfo(
      factory,
      tokenX,
      tokenY,
      binStep
    )
  }
  
  async evmTrJoeGetSwapIn(
    tokenX: string,
    tokenY: string,
    amountOut: Numbers,
    swapForY: boolean,
  ): Promise<any> {
    const pairs: any[] = await this.getPairs(tokenX, tokenY)
    for (const p of pairs) {
      try {
        const pair = await this.getPairInfo(tokenX, tokenY, p.binStep)
        const amountIn: any = await this.contract.methods.getSwapIn(
          pair.address,
          amountOut,
          swapForY
        ).call()
        return amountIn.amountIn
      } catch (error) { }
    }
  }
  
  async evmTrJoeGetSwapOut(
    tokenX: string,
    tokenY: string,
    amountIn: Numbers,
    swapForY: boolean,
  ): Promise<any> {
    const pairs: any[] = await this.getPairs(tokenX, tokenY)
    let resultAmount: any
    for (const p of pairs) {
      try {
        const pair = await this.getPairInfo(tokenX, tokenY, p.binStep)
        const amountOut: any = await this.contract.methods.getSwapOut(
          pair.address,
          amountIn,
          swapForY
        ).call()
        resultAmount = amountOut.amountOut
      } catch (error) { }
    }
    return resultAmount
  }
}

export async function evmTrJoeAddLiquidity(_sender: Web3Account | string, router: string, param: LiquidityParam): Promise<string> {
  const sender = evmAccount(_sender)
  const contract = evmTrJoeLBContract(router)
  let txData: any
  if (param.tokenX === evmNetConfig.wNative || param.tokenY === evmNetConfig.wNative)
    txData = contract.methods.addLiquidityNATIVE(param).encodeABI();
  else
    txData = contract.methods.addLiquidity(param).encodeABI();
  return await evmContractSendTransaction(sender, router, txData)
}

export async function evmTrJoeRemoveLiquidity(_sender: Web3Account | string, router: string, param: RemoveLiquidityParam): Promise<string> {
  const sender = evmAccount(_sender)
  const contract = evmTrJoeLBContract(router)
  const txData = contract.methods.removeLiquidity(param.tokenX, param.tokenY, param.binStep, param.amountXMin, param.amountYMin, param.ids, param.amounts, param.to, param.deadline).encodeABI();
  return await evmContractSendTransaction(sender, router, txData)
}

export async function evmTrJoeSwapExactNATIVEForTokens(
  _trader: Web3Account | string,
  router: string,
  amountInNative: Numbers,
  amountOutMin: Numbers,
  tokenPath: JoePath,
  to: string,
  deadline: number = 0
): Promise<string> {
  const trader = evmAccount(_trader)
  const contract = evmTrJoeLBContract(router)

  const txData = contract.methods.swapExactNATIVEForTokens(
    amountOutMin,
    tokenPath,
    to,
    deadline ? deadline : Math.floor((new Date()).getTime() / 1000) + 3600
  ).encodeABI()
  return await evmContractSendTransaction(trader, router, txData, amountInNative)
}

export async function evmTrJoeSwapExactTokensForNATIVE(
  _trader: Web3Account | string,
  router: string,
  amountInToken: Numbers,
  amountOutMinNative: Numbers,
  tokenPath: JoePath,
  to: string,
  deadline: number = 0
): Promise<string> {
  const trader = evmAccount(_trader)
  const contract = evmTrJoeLBContract(router)

  const txData = contract.methods.swapExactTokensForNATIVE(
    amountInToken,
    amountOutMinNative,
    tokenPath,
    to,
    deadline ? deadline : Math.floor((new Date()).getTime() / 1000) + 3600
  ).encodeABI()
  return await evmContractSendTransaction(trader, router, txData)
}
export async function evmTrJoeSwapExactTokensForTokens(
  _trader: Web3Account | string,
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
    deadline ? deadline : Math.floor((new Date()).getTime() / 1000) + 3600
  ).encodeABI()
  return await evmContractSendTransaction(trader, router, txData)
}

export async function evmTrJoeGetFactory(router: string): Promise<string> {
  const contract = evmTrJoeLBContract(router)
  const factory: string = await contract.methods.getFactory().call()

  return factory
}

export async function evmTrJoeGetPairs(router: string, tokenX: string, tokenY: string): Promise<any[]> {
  const factory: string = await evmTrJoeGetFactory(router)
  const pairs: any = await evmTrJoeFactoryGetPairs(factory, tokenX, tokenY)
  return pairs.map((pair: any) => ({
    address: pair.LBPair,
    binStep: Number(pair.binStep)
  }))
}

export async function evmTrJoeGetPairInfo(router: string, tokenX: string, tokenY: string, binStep: Numbers): Promise<PairInfo> {
  const factory: string = await evmTrJoeGetFactory(router)
  return await evmTrJoeFactoryGetPairInfo(
    factory,
    tokenX,
    tokenY,
    binStep
  )
}

export async function evmTrJoeGetSwapIn(
  router: string,
  tokenX: string,
  tokenY: string,
  amountOut: Numbers,
  swapForY: boolean,
): Promise<any> {
  const contract = evmTrJoeLBContract(router)
  const pairs: any[] = await evmTrJoeGetPairs(
    router,
    tokenX,
    tokenY)
  for (const p of pairs) {
    try {
      const pair = await evmTrJoeGetPairInfo(router, tokenX, tokenY, p.binStep)
      const amountIn: any = await contract.methods.getSwapIn(
        pair.address,
        amountOut,
        swapForY
      ).call()
      return amountIn.amountIn
    } catch (error) { }
  }
}

export async function evmTrJoeGetSwapOut(
  router: string,
  tokenX: string,
  tokenY: string,
  amountIn: Numbers,
  swapForY: boolean,
): Promise<any> {
  const contract = evmTrJoeLBContract(router)
  const pairs: any[] = await evmTrJoeGetPairs(
    router,
    tokenX,
    tokenY)

  let resultAmount: any
  for (const p of pairs) {
    try {
      const pair = await evmTrJoeGetPairInfo(router, tokenX, tokenY, p.binStep)
      const amountOut: any = await contract.methods.getSwapOut(
        pair.address,
        amountIn,
        swapForY
      ).call()
      resultAmount = amountOut.amountOut
    } catch (error) { }
  }
  return resultAmount
}