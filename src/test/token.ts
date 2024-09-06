import { signer } from "."
import { evmTokenGetBalance } from "../token"

const token = "0x2B0db07b28E89f2b4dfbf0bd91E2FdDC1C7C0c54" // testnet
// const token = "0x8934c87bd2368718F975F4A747F7872a423176BF" // mainnet
export async function testToken() {
  const [balance, _] = await evmTokenGetBalance(signer.address, token)
  console.log(balance)
} 