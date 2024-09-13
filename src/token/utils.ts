import { Numbers } from "web3";
import { evmTokenGetDecimals } from "./query";
import { evmWeb3 } from "../endpoint";

export async function evmTokenAmount(token: string, amount: number): Promise<Numbers> {
  const decimals = await evmTokenGetDecimals(token)
  return evmWeb3.utils.toWei(amount.toString(), decimals)
}