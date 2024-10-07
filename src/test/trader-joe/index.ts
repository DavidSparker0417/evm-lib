import BigNumber from "bignumber.js";
import { signer } from "..";
import { evmErc20Approve, evmPFBuy, evmPFCalcAmountEthForToken, evmPFCalcAmountTokenForNative, evmPFCreateToken, evmPFSell } from "../../contract";
import { evmTokenAmount, evmTokenGetBalance, evmTokenGetDecimals, evmTokenGetSymbol } from "../../token";
import { evmWeb3 } from "../../endpoint";
import { LiquidityParam, RemoveLiquidityParam, TrJoePoolInfo } from "../../sdks/trade-joe/types";
import { evmTrJoeGetSwapIn, evmTrJoeAddLiquidity, evmTrJoeGetFactory, evmTrJoeGetPairInfo, evmTrJoeGetPairs, evmTrJoeRemoveLiquidity, evmTrJoeSwapExactNATIVEForTokens, evmTrJoeSwapExactTokensForNATIVE, evmTrJoeSwapExactTokensForTokens, evmTrJoeGetSwapOut, TrJoeRouter } from "../../sdks/trade-joe/pool";
import { evmtrPairApproveAll } from "../../contract/traderjoe";
import { Numbers } from "web3";
import { TrJoeMasterChefV2 } from "../../sdks/trade-joe/masterChefV2";
import { TrJoeLBPair } from "../../sdks/trade-joe/lbPair";
import { evmNetConfig, ZERO_ADRESS } from "../../constants";
import { TrJoeFactory } from "../../sdks";
import { JoeRouter } from "../../sdks/trade-joe/v1/router";
import { evmAddrIsValid, evmWalletGetBalance } from "../../wallet";
import { traderJoeFarmingDeposit, traderJoeFarmingFetch, traderJoeFarmingHarvest, traderJoeFarmingWithdraw, traderJoeFarmInit, traderJoeFarmPoolAdd } from "./farming";
import { traderJoeStakeDeposit, traderJoeStakeAdminOperation, traderJoeStakeFetching, traderJoeStakeHarvest } from "./staking";
import { sleep } from "../../utils";

const lbRouter = evmNetConfig.traderJoe.router
const baseToken = evmNetConfig.usdc
const quoteToken = evmNetConfig.wNative

async function traderJoeAddLiquidity() {
  const [tBalance, tokenBalance] = await evmTokenGetBalance(signer.address, baseToken)
  const decimals = await evmTokenGetDecimals(baseToken)
  const amountX = (tBalance > 0.001) ? evmWeb3.utils.toWei(0.001, decimals) : tokenBalance
  const router = new TrJoeRouter(lbRouter, signer)
  const deadline = Math.floor(new Date().getTime() / 1000) + 3600
  console.log(`[DAVID] deadline : `, deadline)
  const liquidityParams: LiquidityParam = {
    tokenX: baseToken,
    tokenY: quoteToken,
    binStep: "1",
    amountX: amountX,
    amountY: evmWeb3.utils.toWei(0.001, 'ether'),
    amountXMin: "0",
    amountYMin: "0",
    activeIdDesired: BigInt(8388608).toString(),
    idSlippage: 5,
    deltaIds: [-1, 0, 1],
    distributionX: [0, 1e18 / 2, 1e18 / 2],
    distributionY: [(2 * 1e18) / 3, 1e18 / 3, 0],
    to: signer.address,
    refundTo: signer.address,
    deadline
  };

  await evmErc20Approve(signer, baseToken, lbRouter, evmWeb3.utils.toWei(1000, 'ether'))
  await evmErc20Approve(signer, quoteToken, lbRouter, evmWeb3.utils.toWei(1000, 'ether'))
  const txHash = await router.addLiquidity(liquidityParams)
  console.log(`[DAVID] Add liquidity succeeded. txHash :`, txHash)
}

async function testTraderJoeRemoveLiquidity() {
  const pairAddress = "0xa6d38002000409d9ddab4df90dc2432ad9c7d366"
  const liquidityParams: RemoveLiquidityParam = {
    tokenX: baseToken,
    tokenY: quoteToken,
    binStep: "1",
    amountXMin: evmWeb3.utils.toWei(0, 'ether'),
    amountYMin: evmWeb3.utils.toWei(0, 'ether'),
    ids: [2 ** 23 - 1, 2 ** 23, 2 ** 23 + 1],
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
  const router = new TrJoeRouter(lbRouter, signer)
  const amountIn = evmWeb3.utils.toWei("0.0001", 'ether')
  await evmErc20Approve(signer, baseToken, lbRouter, evmWeb3.utils.toWei("1000", 6),)
  const tokenAmountOut = await router.getSwapOut(baseToken, quoteToken, amountIn, false)
  // const tokenAmountOut = await router.getSwapIn(baseToken, quoteToken, amountIn, false)
  console.log(tokenAmountOut)
  // const txHash = await router.swapExactNATIVEForTokens(
  //   amountIn,
  //   "0",
  //   {
  //     pairBinSteps: [1],
  //     versions: [3],
  //     tokenPath: [quoteToken, baseToken]
  //   },
  //   signer.address
  // )
  // console.log(`[DAVID](trader-joe) Swap success: txHash =`, txHash)
}

async function traderJoeSwapTokenForNative() {
  const token = evmNetConfig.usdt
  const [_, tokenBalance] = await evmTokenGetBalance(signer.address, token)
  console.log(`[DAVID] token balance :`, tokenBalance)

  await evmErc20Approve(signer, token, evmNetConfig.traderJoe.router, tokenBalance)
  const amountToSwap = await evmTokenAmount(token, 0.001)

  const minAmountOut = await evmTrJoeGetSwapOut(
    evmNetConfig.traderJoe.router,
    evmNetConfig.usdt,
    evmNetConfig.wNative,
    amountToSwap,
    true
  )
  console.log(`[DAVID](traderJoeSwapTokenForNative) estimated out amount : `, minAmountOut)
  const txHash = await evmTrJoeSwapExactTokensForNATIVE(
    signer,
    evmNetConfig.traderJoe.router,
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
  const base = evmNetConfig.usdt
  const wNative = evmNetConfig.wNative

  const router = new TrJoeRouter(lbRouter, signer)
  const pairInfo = await router.getPairInfo(
    evmNetConfig.usdc,
    evmNetConfig.wNative,
    1
  )

  const pair = new TrJoeLBPair(pairInfo.address, signer)
  console.log(await pair.getTokenX())

  const reserves = await pair.getReserves()
  console.log(reserves)
}
// 0.001999999999746056
async function traderJoePairInfo() {
  const router = new TrJoeRouter(
    evmNetConfig.traderJoe.router,
    signer
  )

  const pairs = await router.getAllPairs()
  console.log(pairs)
}

async function traderJoeCreatePair() {
  const lbRouter = new TrJoeRouter(evmNetConfig.traderJoe.router, signer)
  const factoryAddr = await lbRouter.getFactory()
  const factory = new TrJoeFactory(factoryAddr, signer)
  const txHash = await factory.createLBPair(
    evmNetConfig.usdt,
    evmNetConfig.wNative,
    "8388608",
    1
  )
  console.log(`[DAVID] Pair created! txHash :`, txHash)
}

async function traderAddQuoteAssets() {
  const lbRouter = new TrJoeRouter(evmNetConfig.traderJoe.router, signer)
  const factoryAddr = await lbRouter.getFactory()
  const factory = new TrJoeFactory(factoryAddr, signer)
  let txHash = await factory.addQuoteAsset(
    evmNetConfig.usdc
  )
  console.log(`[DAVID] Quote asset (${evmNetConfig.usdc}) added. txHash:`, txHash)
  txHash = await factory.addQuoteAsset(
    evmNetConfig.wNative
  )
  console.log(`[DAVID] Quote asset (${evmNetConfig.wNative}) added. txHash:`, txHash)
}

async function traderSetPresetOpenState() {
  const lbRouter = new TrJoeRouter(evmNetConfig.traderJoe.router, signer)
  const factoryAddr = await lbRouter.getFactory()
  const factory = new TrJoeFactory(factoryAddr, signer)
  let txHash = await factory.setPresetOpenState(
    25, true
  )
  console.log(`[DAVID] Set PresetOpenState. txHash:`, txHash);
}

async function traderjoeV1AddLiquidity(_tokenX: string, amountX: number, _tokenY: string, amountY: number) {
  const tokenX: string = evmAddrIsValid(_tokenX) ? _tokenX : (evmNetConfig as any)[_tokenX]
  const tokenY: string = evmAddrIsValid(_tokenY) ? _tokenY : (evmNetConfig as any)[_tokenY]
  const joeRouter = new JoeRouter(evmNetConfig.traderJoe.joeRouter, signer)

  let txHash: string = ''
  if (tokenX.toLowerCase() === evmNetConfig.wNative.toLowerCase()) {
    const tokenDecimals = await evmTokenGetDecimals(tokenY)
    const tokenAmount = evmWeb3.utils.toWei(amountY, tokenDecimals)
    await evmErc20Approve(signer, tokenY, joeRouter.address, tokenAmount)
    txHash = await joeRouter.addLiquidityNative(
      tokenY,
      tokenAmount,
      0,
      evmWeb3.utils.toWei(amountX, 'ether'),
      signer.address
    )
  } else if (tokenY.toLowerCase() === evmNetConfig.wNative.toLowerCase()) {
    const tokenDecimals = await evmTokenGetDecimals(tokenX)
    const tokenAmount = evmWeb3.utils.toWei(amountX, tokenDecimals)
    await evmErc20Approve(signer, tokenX, joeRouter.address, tokenAmount)
    txHash = await joeRouter.addLiquidityNative(
      tokenX,
      tokenAmount,
      0,
      evmWeb3.utils.toWei(amountY, 'ether'),
      signer.address
    )
  } else {
    const tokenXDecimals = await evmTokenGetDecimals(tokenX)
    const tokenYDecimals = await evmTokenGetDecimals(tokenX)
    txHash = await joeRouter.addLiquidity(
      tokenX,
      tokenY,
      evmWeb3.utils.toWei(amountX, tokenXDecimals),
      evmWeb3.utils.toWei(amountY, tokenYDecimals),
      0,
      0,
      signer.address
    )
  }
  console.log(`[DAVID](traderjoeV1CreatePair) Liquidity added! txHash =`, txHash)
}

export async function testTraderJoe() {
  // 0. set preset open state
  // await traderSetPresetOpenState();
  // 1. add quote assets
  // await traderAddQuoteAssets()
  // 2. create pair
  // await traderJoeCreatePair()
  // 3. add liquidity
  // await traderJoeAddLiquidity()
  // 4. add lp token of the pool
  // await testTraderJoeRemoveLiquidity()
  // await traderJoeSwap()
  // await traderJoeSwapNativeForToken()
  // await traderJoeSwapTokenForNative()
  // await traderJoeFetching()
  // await traderJoePairInfo()

  // ++++++++++++++++++++++++ V1 ++++++++++++++++++++++++
  // ------------- farming
  await traderJoeFarmInit()
  await traderjoeV1AddLiquidity('usdt', 0.01, 'wNative', 0.01)
  await traderJoeFarmPoolAdd()
  await traderJoeFarmingDeposit()
  await sleep(5000)
  await traderJoeFarmingHarvest()
  await sleep(5000)
  await traderJoeFarmingWithdraw()
  await traderJoeFarmingFetch()

  // ------------- staking
  // await traderJoeStakeAdminOperation()
  // await traderJoeStakeDeposit()
  // await traderJoeStakeHarvest()
  // await traderJoeStakeFetching()
}