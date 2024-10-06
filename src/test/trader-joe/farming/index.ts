import { signer } from "../.."
import { evmNetConfig, ZERO_ADRESS } from "../../../constants"
import { evmErc20Approve } from "../../../contract"
import { evmWeb3 } from "../../../endpoint";
import { BMCJ } from "../../../sdks/trade-joe/bmcj";
import { TrJoeMasterChefV2 } from '../../../sdks/trade-joe/masterChefV2';
import { JoeRouter } from "../../../sdks/trade-joe/v1/router"
import { evmTokenGetBalance, evmTokenGetDecimals } from "../../../token";

export async function traderJoeFarmPoolAdd() {
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  let txHash
  // 1. initialize
  const mcj = new TrJoeMasterChefV2(await bmcj.MASTER_CHEF_V2(), signer)
  await mcj.addPool(
    0,
    evmNetConfig.traderJoe.bmcjt,
    ZERO_ADRESS
  )
  txHash = await bmcj.init(evmNetConfig.traderJoe.bmcjt)
  console.log(`[DAVID](traderJoeFarmPoolAdd) new pool added! txHash =`, txHash)
  // 2. add pool
  // const router = new JoeRouter(evmNetConfig.traderJoe.joeRouter, signer)
  // const usdcPairAddr = await router.getPair(evmNetConfig.usdt, evmNetConfig.wNative)
  // txHash = await bmcj.addPool(1, 100, usdcPairAddr, ZERO_ADRESS)
  // console.log(`[DAVID](traderJoeFarmPoolAdd) new pool added! txHash =`, txHash)
}

export async function traderJoeFarmingDeposit() {
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
  const bmcj = new BMCJ(
    evmNetConfig.traderJoe.bmcj,
    signer
  )
  // 2.1 get pool list
  const poolId = await bmcj.findPoolId(tokenX, tokenY)
  await evmErc20Approve(signer, lpToken, bmcj.address, lpBalance)
  console.log(`[DAVID] Depositing lp to pool(${poolId}) ...`)
  const txHash = await bmcj.deposit(poolId, lpBalance)
  console.log(`[DAVID] deposit succeeded. txHash = ${txHash}`)
}

export async function traderJoeFarmingHarvest() {
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  const txHash = await bmcj.harvest(1)
  console.log(`[DAVID] harvest! txHash =`, txHash)
}

export async function traderJoeFarmingWithdraw() {
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  const txHash = await bmcj.withdraw(1)
  console.log(`[DAVID] withdraw! txHash =`, txHash)
}

export async function traderJoeFarmingFetch() {
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  console.log(await bmcj._poolInfo(0))

  const mchefV2Addr = await bmcj.MASTER_CHEF_V2()
  console.log(mchefV2Addr)
  const mchefV2 = new TrJoeMasterChefV2(mchefV2Addr, signer)
  console.log(await mchefV2.totalAllocPoint())

  const joe = await bmcj.JOE()
  const joeDecimals = await evmTokenGetDecimals(joe)
  const pendingJoeToken = await bmcj.pendingTokens(0, signer.address)
  console.log(`[DAVID] FARM pending rewards : `, pendingJoeToken)
  // console.log(`[DAVID] FARM pending rewards : `, evmWeb3.utils.fromWei(pendingJoeToken, joeDecimals))
  console.log(`[DAVID] Current Joe token balance :`, await evmTokenGetBalance(signer.address, joe))
  // const poolInfo = await bmcj.poolInfo(0)
  // console.log(`[DAVID] poolInfo :`, poolInfo)
}
