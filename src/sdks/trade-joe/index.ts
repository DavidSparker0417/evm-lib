import { evmWeb3 } from "../../endpoint"
import LBRouterAbi from "./abis/LBRouter.json"
import LBFactoryAbi from "./abis/LBFactory.json"
import StakeAbi from "./abis/StableJoeStaking.json"
import JoeTokenAbi from "./abis/JoeToken.json"

export function evmTrJoeLBContract(address: string) {
  const contract = new evmWeb3.eth.Contract(LBRouterAbi, address)
  return contract
}

export function evmTrJoeLBFactory(address: string) {
  const contract = new evmWeb3.eth.Contract(LBFactoryAbi, address)
  return contract
}

export function evmTrJoeStaking(address: string) {
  const contract = new evmWeb3.eth.Contract(StakeAbi, address)
  return contract
}

export function evmTrJoeToken(address: string) {
  const contract = new evmWeb3.eth.Contract(JoeTokenAbi, address)
  return contract
}

export * from "./factory"
export * from "./pool"
export * from "./bmcj"
export * from "./joeToken"
export * from "./lbPair"
export * from "./masterChefV2"
export * from "./stake"
export * from "./types"