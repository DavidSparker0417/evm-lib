import BigNumber from "bignumber.js";
import { curConfig, signer } from ".";
import { evmErc20Approve, evmPFBuy, evmPFCalcAmountEthForToken, evmPFCalcAmountTokenForNative, evmPFCreateToken, evmPFSell } from "../contract";
import { evmTokenAmount, evmTokenGetBalance, evmTokenGetDecimals } from "../token";
import { evmWeb3 } from "../endpoint";
import { LiquidityParam, RemoveLiquidityParam } from "../sdks/trade-joe/types";
import { evmTrJoeGetSwapIn, evmTrJoeAddLiquidity, evmTrJoeGetFactory, evmTrJoeGetPairInfo, evmTrJoeGetPairs, evmTrJoeRemoveLiquidity, evmTrJoeSwapExactNATIVEForTokens, evmTrJoeSwapExactTokensForNATIVE, evmTrJoeSwapExactTokensForTokens, evmTrJoeGetSwapOut } from "../sdks/trade-joe/pool";
import { evmtrPairApproveAll } from "../contract/traderjoe";
import { Numbers } from "web3";
import { evmTrJoeTokenMint } from "../sdks/trade-joe/joeToken";
import { evmTrJoeMasterChefV2 } from "../sdks/trade-joe/masterChefV2";
import { evmTrJoeLBPair } from "../sdks/trade-joe/lbPari";

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
  const [_, amountToken] = await evmTokenGetBalance(signer.address, token)
  const tokenDecimals = await evmTokenGetDecimals(token)
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
const baseToken = "0x702DC8AfCc61d28dA5D8Fd131218fbe8DAF19CeC"
const quoteToken = "0x57eE725BEeB991c70c53f9642f36755EC6eb2139"
async function traderJoeAddLiquidity() {
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
  const pairAddress = "0xa6d38002000409d9ddab4df90dc2432ad9c7d366"
  const liquidityParams:RemoveLiquidityParam = {
    tokenX: baseToken,
    tokenY: quoteToken,
    binStep: "1",
    amountXMin: evmWeb3.utils.toWei(0, 'ether'),
    amountYMin: evmWeb3.utils.toWei(0, 'ether'),
    ids: [2**23 - 1, 2**23, 2**23 + 1],
    amounts: [evmWeb3.utils.toWei(1, 'ether'), evmWeb3.utils.toWei(1, 'ether'), evmWeb3.utils.toWei(1, 'ether')],
    to: signer.address,
    deadline: Math.floor(new Date().getTime() / 1000) + 3600
  };

  await evmtrPairApproveAll(signer, pairAddress, lbRouter)
  await evmTrJoeRemoveLiquidity(
    signer, 
    lbRouter,
    liquidityParams)
}

async function traderJoeSwap() {
  const [_, balanceX] = await evmTokenGetBalance(signer.address, baseToken)

  await evmErc20Approve(signer, baseToken, lbRouter, balanceX)
  const txHash = await evmTrJoeSwapExactTokensForTokens(
    signer,
    lbRouter,
    evmWeb3.utils.toWei(1, 'ether'),
    evmWeb3.utils.toWei(0, 'ether'),
    {
      pairBinSteps: [1],
      versions: [3],
      tokenPath: [quoteToken, baseToken]
    },
    signer.address
  )
  console.log(`[DAVID](trader-joe) Swap success: txHash =`, txHash)
}

async function traderJoeSwapNativeForToken() {
  const txHash = await evmTrJoeSwapExactNATIVEForTokens(
    signer,
    lbRouter,
    evmWeb3.utils.toWei("0.001", 'ether'),
    "0",
    {
      pairBinSteps: [1],
      versions: [3],
      tokenPath: [quoteToken, baseToken]
    },
    signer.address
  )
  console.log(`[DAVID](trader-joe) Swap success: txHash =`, txHash)
}

async function traderJoeSwapTokenForNative() {
  const token = curConfig.usdt
  const [_, tokenBalance] = await evmTokenGetBalance(signer.address, token)
  console.log(`[DAVID] token balance :`, tokenBalance)

  await evmErc20Approve(signer, token, curConfig.traderJoe.router, tokenBalance)
  const amountToSwap = await evmTokenAmount(token, 0.001)

  const minAmountOut = await evmTrJoeGetSwapOut(
    curConfig.traderJoe.router, 
    curConfig.usdt,
    curConfig.wNative,
    amountToSwap,
    true
  )
  console.log(`[DAVID](traderJoeSwapTokenForNative) estimated out amount : `, minAmountOut)
  const txHash = await evmTrJoeSwapExactTokensForNATIVE(
    signer,
    curConfig.traderJoe.router,
    amountToSwap,
    minAmountOut,
    {
      pairBinSteps: [1],
      versions: [3],
      tokenPath: [baseToken, quoteToken]
    },
    signer.address
  )
  console.log(`[DAVID](trader-joe) Swap success: txHash =`, txHash)
}

async function traderJoeFetching() {
  const base = curConfig.usdt
  const wNative = curConfig.wNative

  const pairInfo = await evmTrJoeGetPairInfo(
    curConfig.traderJoe.router,
    curConfig.usdc,
    curConfig.wNative,
    5
  )

  const pair = new evmTrJoeLBPair(pairInfo.address, signer)
  console.log(await pair.getTokenX())

  const activeId = await pair.getActiveId()
  console.log(activeId)
}

async function traderJoeFarming() {
  const masterChef = new evmTrJoeMasterChefV2(
    curConfig.traderJoe.masterChefV2,
    signer
  )
  const poolInfo = await masterChef.poolInfo(0)

  const lpAmount = await evmTokenGetBalance(signer.address, poolInfo.lpToken)
  console.log(lpAmount)
}

export async function testContract() {
  // await traderJoeAddLiquidity()
  // await testTraderJoeRemoveLiquidity()
  // await traderJoeSwap()
  // await traderJoeSwapNativeForToken()
  // await traderJoeSwapTokenForNative()
  await traderJoeFetching()
  // await traderJoeFarming()
}