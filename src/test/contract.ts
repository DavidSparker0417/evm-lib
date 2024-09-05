import BigNumber from "bignumber.js";
import { signer } from ".";
import { evmErc20Approve, evmPFBuy, evmPFCalcAmountEthForToken, evmPFCalcAmountTokenForNative, evmPFCreateToken, evmPFSell } from "../contract";
import { evmTokenGetBalance, evmTokenGetDecimals } from "../token";
import { evmWeb3 } from "../endpoint";
// ------------- testnet(base) -------------
// const BONDING_CURVE = "0x92b4b9Cdc87B90250561b354a7e659619f198fd0"
// const token = "0xF4ea86B037258e8b3f0E78f96A651543912635A0"
// ------------- mainnet(base) -------------
// const BONDING_CURVE = "0x9A132b310eED1D8A15f92491A3026d0cDe773D91"
// const token = "0x8934c87bd2368718F975F4A747F7872a423176BF"

// ------------- testnet(sepolia) -------------
const BONDING_CURVE = "0x8aA4cfC357390afB5dF17c35036A1b9d1EeC2Db6"
const token = "0xB8D2D5635A076B6856e3A5Dd5A49E804FA51e8ff"

export async function testContract() {
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