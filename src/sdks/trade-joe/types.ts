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

export interface PairInfo {
  address: string,
  binStep: number,
  tokenX?: string | undefined,
  tokenY?: string | undefined,
  activeId?: Numbers
}

export interface TrJoePoolInfo {
  tokenX: {
    address: string,
    amount: Numbers
  }
  tokenY: {
    address: string,
    amount: Numbers
  },
  liquidity: Number
  apr: Number,
  lpToken: string,
  amount: Numbers,
}

export interface FarmUserInfo {
  amount: Numbers
  reward: Numbers
}