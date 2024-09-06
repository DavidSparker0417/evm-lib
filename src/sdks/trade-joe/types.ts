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