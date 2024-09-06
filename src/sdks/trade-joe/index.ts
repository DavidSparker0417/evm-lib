import { evmWeb3 } from "../../endpoint"
import LBRouterAbi from "./abis/LBRouter.json"

export function evmTrJoeLBContract(address: string) {
  const contract = new evmWeb3.eth.Contract(LBRouterAbi, address)
  return contract
}

export * from "./factory"
export * from "./pool"