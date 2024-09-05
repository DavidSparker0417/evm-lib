import { signer } from "."
import { evmWalletCreate, evmWalletGetBalance, evmWalletImport, evmWalletTransferNative } from "../wallet"

export async function testWallet() {
  let walletBalance = await evmWalletGetBalance(signer.address)
  console.log(walletBalance)

  // const txHash = await evmWalletTransferNative(
  //   signer, 
  //   "0x27e0C3c11F2184C323d8c16129b3A26CC5c7b382",
  //   0.1
  // )
  // console.log(txHash)
}