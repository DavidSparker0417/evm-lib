import { signer } from "."
import { evmNetConfig } from "../constants"
import { evmErc20GetMeta } from "../contract"
import { evmTokenGetBalance } from "../token"

export async function testToken() {
  const [balance, _] = await evmTokenGetBalance(signer.address, evmNetConfig.usdt)
  console.log(balance)

  const tokenMeta = await evmErc20GetMeta(evmNetConfig.usdt)
  console.log(`[DAVID](testToken) tokenMeta :`, tokenMeta)
} 