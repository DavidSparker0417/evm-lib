import BigNumber from "bignumber.js";
import { signer } from ".";
import { evmErc20Approve, evmPFBuy, evmPFCalcAmountEthForToken, evmPFCalcAmountTokenForNative, evmPFCreateToken, evmPFSell } from "../contract";
import { evmTokenAmount, evmTokenGetBalance, evmTokenGetDecimals } from "../token";
import { evmWeb3 } from "../endpoint";
import { LiquidityParam, RemoveLiquidityParam, TrJoePoolInfo } from "../sdks/trade-joe/types";
import { evmTrJoeGetSwapIn, evmTrJoeAddLiquidity, evmTrJoeGetFactory, evmTrJoeGetPairInfo, evmTrJoeGetPairs, evmTrJoeRemoveLiquidity, evmTrJoeSwapExactNATIVEForTokens, evmTrJoeSwapExactTokensForNATIVE, evmTrJoeSwapExactTokensForTokens, evmTrJoeGetSwapOut, TrJoeRouter } from "../sdks/trade-joe/pool";
import { evmtrPairApproveAll } from "../contract/traderjoe";
import { Numbers } from "web3";
// import { evmTrJoeTokenMint } from "../sdks/trade-joe/joeToken";
import { TrJoeMasterChefV2 } from "../sdks/trade-joe/masterChefV2";
import { TrJoeLBPair } from "../sdks/trade-joe/lbPair";
import { evmNetConfig, ZERO_ADRESS } from "../constants";
import { TrJoeFactory } from "../sdks";
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

async function traderJoeFarming() {
  const tokenX = evmNetConfig.usdc
  const tokenY = evmNetConfig.wNative
  const binStep = 1;
  // 1.get the usdc-wNative lp
  const router = new TrJoeRouter(evmNetConfig.traderJoe.router, signer)
  // 1.1. check lp balance
  const lpBalance = await router.getLpBalance(signer.address, tokenX, tokenY, binStep)
  console.log(`[DAVID] (usdc-native) lp balance =`, lpBalance)
  if (!lpBalance) {
    console.log(`[DAVID] Insufficient balance to deposit`)
    return
  }
  // 2. deposit lp to master chef usdc-wNative lp
  const masterChefV2 = new TrJoeMasterChefV2(
    evmNetConfig.traderJoe.MasterChefJoeV2,
    signer
  )
  // 2.1 get pool list
  const poolId = await masterChefV2.findPoolId(tokenX, tokenY, 1)
  console.log(`[DAVID] Depositing lp to pool(${poolId}) ...`)
  const txHash = await masterChefV2.deposit(poolId, lpBalance)
  console.log(`[DAVID] deposit succeeded. txHash = ${txHash}`)
}

async function traderJoeCreatePair() {
  const factory = new TrJoeFactory(evmNetConfig.traderJoe.factory, signer)
  const txHash = await factory.createLBPair(
    evmNetConfig.usdt,
    evmNetConfig.wNative,
    "8388608",
    1
  )
  console.log(`[DAVID] Pair created! txHash :`, txHash)
}

async function traderAddQuoteAssets() {
  const factory = new TrJoeFactory(evmNetConfig.traderJoe.factory, signer)
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
  const factory = new TrJoeFactory(evmNetConfig.traderJoe.factory, signer)
  let txHash = await factory.setPresetOpenState(
    25, true
  )
  console.log(`[DAVID] Set PresetOpenState. txHash:`, txHash);
}

async function traderJoeFarmPoolAdd() {
  const masterChefV2 = new TrJoeMasterChefV2(evmNetConfig.traderJoe.MasterChefJoeV2, signer)
  const router = new TrJoeRouter(evmNetConfig.traderJoe.router, signer)
  const pairInfo =  await router.getPairInfo(
    evmNetConfig.usdc, evmNetConfig.wNative, 1
  )
  await masterChefV2.addPool(1, pairInfo.address, ZERO_ADRESS)
}
export async function testContract() {
  // 0. set preset open state
    // await traderSetPresetOpenState();
  // 1. add quote assets
  // await traderAddQuoteAssets()
  // 2. create pair
  // await traderJoeCreatePair()
  // 3. add liquidity
  // await traderJoeAddLiquidity()
  // 4. add lp token of the pool
  // await traderJoeFarmPoolAdd()
  // await testTraderJoeRemoveLiquidity()
  // await traderJoeSwap()
  await traderJoeSwapNativeForToken()
  // await traderJoeSwapTokenForNative()
  // await traderJoeFetching()
  // await traderJoePairInfo()
  // await traderJoeFarming()
}