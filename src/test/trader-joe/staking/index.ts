import { signer } from "../..";
import { dexScreenerTokenPrice } from "../../../3rdparty/dexscreener";
import { evmNetConfig, netConfigs } from "../../../constants";
import { evmErc20Approve } from "../../../contract";
import { TrJoeMasterChefV2 } from "../../../sdks/trade-joe/masterChefV2";
import { TrJoeStableJoeStaking } from "../../../sdks/trade-joe/stake";
import { evmTokenGetBalance } from "../../../token";

export async function traderJoeStakeFetching() {
  const stake = new TrJoeStableJoeStaking(evmNetConfig.traderJoe.sJoeStaking, signer)
  console.log(await stake.pendingReward(signer.address, evmNetConfig.usdt))
}

export async function traderJoeStakeDeposit() {
  const stake = new TrJoeStableJoeStaking(evmNetConfig.traderJoe.sJoeStaking, signer)
  const joe = await stake.joe()
  const [_, joeBalance] = await evmTokenGetBalance(signer.address, joe)
  await evmErc20Approve(signer, joe, stake.address, joeBalance)
  const txHash = await stake.deposit(joeBalance)
  console.log(`[DAVID](TRJOE-STAKE) deposit. txHash =`, txHash)
}

export async function traderJoeStakeHarvest() {
  const stake = new TrJoeStableJoeStaking(evmNetConfig.traderJoe.sJoeStaking, signer)
  const txHash = await stake.harvest()
  console.log(`[DAVID](TRJOE-STAKE) haevest. txHash =`, txHash)
}
export async function traderJoeStakeAdminOperation() {
  const stake = new TrJoeStableJoeStaking(evmNetConfig.traderJoe.sJoeStaking, signer)
  let txHash
}