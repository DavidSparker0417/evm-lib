import { signer } from "../.."
import { evmNetConfig, ZERO_ADRESS } from "../../../constants"
import { evmErc20Approve, evmErc20GetOwner, evmErc20Mint } from "../../../contract"
import { evmWeb3 } from "../../../endpoint";
import { BMCJ } from "../../../sdks/trade-joe/bmcj";
import { TrJoeMasterChefV2 } from '../../../sdks/trade-joe/masterChefV2';
import { JoeRouter } from '../../../sdks/trade-joe/v1/router';
import { evmTokenGetBalance, evmTokenGetDecimals } from "../../../token";

export async function traderJoeFarmInit() {
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  const joeRouter = new JoeRouter(evmNetConfig.traderJoe.joeRouter, signer)
  const joe = await bmcj.JOE()
  const mcj = new TrJoeMasterChefV2(await bmcj.MASTER_CHEF_V2(), signer)
  let txHash
  
  // 1. create pair for bmcjt-wNative
  // console.log(`[DAIVD](traderJoeFarmInit) 1. create pair for joe-wNative`)
  // txHash = await joeRouter.createPair(joe, evmNetConfig.wNative)
  // console.log(`[DAVID] pair created! txHash =`, txHash)
  
  // 2. add master pool to masterchefV2
  console.log(`[DAIVD](traderJoeFarmInit) 2. add master pool to masterchefV2`)
  txHash = await mcj.addPool(
    1,
    evmNetConfig.traderJoe.bmcjt,
    ZERO_ADRESS
  )
  console.log(`[DAVID](traderJoeFarmInit) master pool added to mcj ! txHash =`, txHash)

  // 4. initialize boosted masterchef joe
  console.log(`[DAIVD](traderJoeFarmInit) 4. initialize boosted masterchef joe`)
  txHash = await bmcj.init(evmNetConfig.traderJoe.bmcjt)
  console.log(`[DAVID](traderJoeFarmInit) bmcj init! txHash =`, txHash)
}
export async function traderJoeFarmPoolAdd() {
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  const router = new JoeRouter(evmNetConfig.traderJoe.joeRouter, signer)
  const usdtPairAddr = await router.getPair(evmNetConfig.usdt, evmNetConfig.wNative)
  let txHash = await bmcj.addPool(1, 100, usdtPairAddr, ZERO_ADRESS)
  console.log(`[DAVID](traderJoeFarmPoolAdd) new pool added! txHash =`, txHash)
}

export async function traderJoeFarmingDeposit() {
  const tokenX = evmNetConfig.usdt
  const tokenY = evmNetConfig.wNative

  // 1.get the usdt-wNative lp
  const router = new JoeRouter(evmNetConfig.traderJoe.joeRouter, signer)
  // 1. check lp balance
  const lpToken = await router.getPair(tokenX, tokenY)
  const lpBalance = await router.getLpBalance(signer.address, tokenX, tokenY)
  console.log(`[DAVID] (usdt-native) lp balance =`, lpBalance)
  if (!lpBalance) {
    console.log(`[DAVID] Insufficient balance to deposit`)
    return
  }
  // 2. deposit lp to master chef usdt-wNative lp
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
  const tokenX = evmNetConfig.usdt
  const tokenY = evmNetConfig.wNative
  
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  const poolId = await bmcj.findPoolId(tokenX, tokenY)
  const txHash = await bmcj.harvest(poolId)
  console.log(`[DAVID] harvest! txHash =`, txHash)
}

export async function traderJoeFarmingWithdraw() {
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  const txHash = await bmcj.withdraw(0)
  console.log(`[DAVID] withdraw! txHash =`, txHash)
}

export async function traderJoeFarmingFetch() {
  const bmcj = new BMCJ(evmNetConfig.traderJoe.bmcj, signer)
  const joe = await bmcj.JOE()
  const pendingJoeToken = await bmcj.pendingTokens(0, signer.address)
  console.log(`[DAVID] FARM pending rewards : `, pendingJoeToken)
  console.log(`[DAVID] Current Joe token balance :`, await evmTokenGetBalance(signer.address, joe))
  const poolInfo = await bmcj.poolInfo(0)
  console.log(`[DAVID] poolInfo :`, poolInfo)
}
