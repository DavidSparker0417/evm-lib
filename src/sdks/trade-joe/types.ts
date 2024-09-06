import { Numbers } from "web3";

export interface LiquidityParam {
  tokenX: string,
  tokenY: string,
  binStep: Numbers,
  amountX: Numbers,
  amountY: Numbers,
  amountXMin: Numbers,
  amountYMin: Numbers,
  activeIdDesired: Numbers,
  idSlippage: number,
  deltaIds: number[],
  distributionX: number[],
  distributionY: number[],
  to: string,
  refundTo: string,
  deadline: number
}

export interface RemoveLiquidityParam {
  tokenX: string,
  tokenY: string,
  binStep: Numbers,
  amountXMin: Numbers,
  amountYMin: Numbers,
  ids: number[],
  amounts: Numbers[],
  to: string,
  deadline: number
}

export interface JoePath {
  pairBinSteps: Numbers[],
  versions: number[],
  tokenPath: string[]
}