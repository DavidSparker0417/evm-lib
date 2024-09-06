import BigNumber from "bignumber.js";
import { signer } from ".";
import { evmErc20Approve, evmPFBuy, evmPFCalcAmountEthForToken, evmPFCalcAmountTokenForNative, evmPFCreateToken, evmPFSell } from "../contract";
import { evmTokenGetBalance, evmTokenGetDecimals } from "../token";
import { evmWeb3 } from "../endpoint";
import { LiquidityParam } from "../sdks/trade-joe/types";
import { evmTrJoeAddLiquidity, evmTrJoeRemoveLiquidity, evmTrJoeSwapExactTokensForTokens } from "../sdks/trade-joe/pool";
import { evmtrPairApproveAll } from "../contract/traderjoe";

// ------------- testnet(base) -------------
// const BONDING_CURVE = "0x92b4b9Cdc87B90250561b354a7e659619f198fd0"
// const token = "0xF4ea86B037258e8b3f0E78f96A651543912635A0"
// ------------- mainnet(base) -------------
// const BONDING_CURVE = "0x9A132b310eED1D8A15f92491A3026d0cDe773D91"
// const token = "0x8934c87bd2368718F975F4A747F7872a423176BF"

// ------------- testnet(sepolia) -------------
const BONDING_CURVE = "0x8aA4cfC357390afB5dF17c35036A1b9d1EeC2Db6"
const token = "0xB8D2D5635A076B6856e3A5Dd5A49E804FA51e8ff"

async function testPumpFun() {
  // await evmPFCreateToken(signer, BONDING_CURVE, {
  //   name: 'test',
  //   symbol: 'test',
  //   decimals: 18,
  //   logo: "https://silver-thirsty-damselfly-699.mypinata.cloud/ipfs/QmZHPtqgNGLGEZNtuhMG5nJWBPKe1xCdKakGdit41y9u3Q"
  // }, 0)

  // buy
  const ethAmountToBuy = 0.0001
  const slippage = 5
  // let tokenAmount = BigInt(await evmPFCalcAmountTokenForNative(BONDING_CURVE, token, ethAmountToBuy))
  // tokenAmount = BigInt((new BigNumber(tokenAmount.toString()).multipliedBy(100 - slippage)).dividedBy(100).toFixed(0))
  // await evmPFBuy(
  //   signer, 
  //   BONDING_CURVE, 
  //   token,
  //   tokenAmount,
  //   ethAmountToBuy,
  //   2 * 60
  // )

  // --------------- sell ----------------
  // 1. get the amount of token to sell
  const tokenBalance = await evmTokenGetBalance(signer.address, token)
  const tokenDecimals = await evmTokenGetDecimals(token)
  const amountToken = evmWeb3.utils.toWei(tokenBalance, tokenDecimals)
  // 2. approve
  await evmErc20Approve(signer, token, BONDING_CURVE, amountToken)
  // 3. sell
  let ethAmount = BigInt(await evmPFCalcAmountEthForToken(BONDING_CURVE, token, amountToken))
  ethAmount = BigInt((new BigNumber(ethAmount.toString()).multipliedBy(100 - slippage)).dividedBy(100).toFixed(0))
  await evmPFSell(
    signer, 
    BONDING_CURVE, 
    token,
    amountToken,
    ethAmount,
    2 * 60
  )
}

const lbRouter = "0xe20e58B747bC1E9753DF595D19001B366f49A78D"
async function traderJoeAddLiquidity() {
  const baseToken = "0x702DC8AfCc61d28dA5D8Fd131218fbe8DAF19CeC"
  const quoteToken = "0x57eE725BEeB991c70c53f9642f36755EC6eb2139"
  const liquidityParams:LiquidityParam = {
    tokenX: baseToken,
    tokenY: quoteToken,
    binStep: "1",
    amountX: evmWeb3.utils.toWei(20, 'ether'),
    amountY: evmWeb3.utils.toWei(20, 'ether'),
    amountXMin: evmWeb3.utils.toWei(10, 'ether'),
    amountYMin: evmWeb3.utils.toWei(10, 'ether'),
    activeIdDesired: BigInt(2 ** 23).toString(),
    idSlippage: 5,
    deltaIds: [-1, 0, 1],
    distributionX: [0, 1e18 / 2, 1e18 / 2],
    distributionY: [(2 * 1e18) / 3, 1e18 / 3, 0],
    to: signer.address,
    refundTo: signer.address,
    deadline: Math.floor(new Date().getTime() / 1000) + 3600
  };

  await evmErc20Approve(signer, baseToken, lbRouter, evmWeb3.utils.toWei(1000, 'ether'))
  await evmErc20Approve(signer, quoteToken, lbRouter, evmWeb3.utils.toWei(1000, 'ether'))
  await evmTrJoeAddLiquidity(
    signer, 
    lbRouter,
    liquidityParams)
}

async function testTraderJoeRemoveLiquidity() {
  const baseToken = "0x702DC8AfCc61d28dA5D8Fd131218fbe8DAF19CeC"
  const quoteToken = "0x57eE725BEeB991c70c53f9642f36755EC6eb2139"
  const pairAddress = "0xa6d38002000409d9ddab4df90dc2432ad9c7d366"
  const lbRouter = "0xe20e58B747bC1E9753DF595D19001B366f49A78D"
  const liquidityParams:LiquidityParam = {
    tokenX: baseToken,
    tokenY: quoteToken,
    binStep: "1",
    amountX: evmWeb3.utils.toWei(20, 'ether'),
    amountY: evmWeb3.utils.toWei(20, 'ether'),
    amountXMin: evmWeb3.utils.toWei(10, 'ether'),
    amountYMin: evmWeb3.utils.toWei(10, 'ether'),
    activeIdDesired: BigInt(2 ** 23).toString(),
    idSlippage: 5,
    deltaIds: [-1, 0, 1],
    distributionX: [0, 1e18 / 2, 1e18 / 2],
    distributionY: [(2 * 1e18) / 3, 1e18 / 3, 0],
    to: signer.address,
    refundTo: signer.address,
    deadline: Math.floor(new Date().getTime() / 1000) + 3600
  };

  await evmtrPairApproveAll(signer, pairAddress, lbRouter)
  // await evmTrJoeRemoveLiquidity(
  //   signer, 
  //   lbRouter,
  //   liquidityParams)
}

async function traderJoeSwap() {
  // await evmTrJoeSwapExactTokensForTokens(
  //   signer,
  //   lbRouter,
    
  // )
}

export async function testContract() {
  // await testTraderJoeAddLiquidity()
  await testTraderJoeRemoveLiquidity()
}