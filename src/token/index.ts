import { evmWeb3 } from "../endpoint"
import erc20Abi from "./abis/erc20.json"

export * from "./query"

export function evmTokenContract(address: string) {
  const contract = new evmWeb3.eth.Contract(erc20Abi, address)
  return contract
}