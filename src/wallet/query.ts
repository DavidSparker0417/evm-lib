import { evmWeb3 } from "../endpoint"

export async function evmWalletGetBalance(address: string): Promise<number> {
  const balance = await evmWeb3.eth.getBalance(address)
  return Number(evmWeb3.utils.fromWei(balance, 'ether'))
}