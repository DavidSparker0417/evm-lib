import { signer } from "../.."
import { evmNetConfig, ZERO_ADRESS } from "../../../constants"
import { evmErc20Approve } from "../../../contract"
import { TrJoeMasterChefV2 } from '../../../sdks/trade-joe/masterChefV2';
import { JoeRouter } from "../../../sdks/trade-joe/v1/router"
import { evmTokenGetBalance } from "../../../token";

export async function traderJoeFarmPoolAdd() {
  const masterChefV2 = new TrJoeMasterChefV2(evmNetConfig.traderJoe.MasterChefJoeV2, signer)
  const router = new JoeRouter(evmNetConfig.traderJoe.joeRouter, signer)
  const usdcPairAddr = await router.getPair(evmNetConfig.usdc, evmNetConfig.wNative)
  const txHash = await masterChefV2.addPool(1, usdcPairAddr, ZERO_ADRESS)
  console.log(`[DAVID](traderJoeFarmPoolAdd) new pool added! txHash =`, txHash)
}

export async function traderJoeFarming() {
  const tokenX = evmNetConfig.usdc
  const tokenY = evmNetConfig.wNative
  
  // 1.get the usdc-wNative lp
  const router = new JoeRouter(evmNetConfig.traderJoe.joeRouter, signer)
  // 1.1. check lp balance
  const lpToken = await router.getPair(tokenX, tokenY)
  const lpBalance = await router.getLpBalance(signer.address, tokenX, tokenY)
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
  const poolId = await masterChefV2.findPoolId(tokenX, tokenY)
  await evmErc20Approve(signer, lpToken, masterChefV2.address, lpBalance)
  console.log(`[DAVID] Depositing lp to pool(${poolId}) ...`)
  const txHash = await masterChefV2.deposit(poolId, lpBalance)
  console.log(`[DAVID] deposit succeeded. txHash = ${txHash}`)
}

export async function traderJoeFarmingFetch() {
  const masterChefV2 = new TrJoeMasterChefV2(evmNetConfig.traderJoe.MasterChefJoeV2, signer)
  const joe = await masterChefV2.joe()
  console.log(await evmTokenGetBalance(signer.address, joe))
}