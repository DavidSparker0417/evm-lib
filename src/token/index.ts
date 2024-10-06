import { netConfigs } from "../constants"
import { evmWeb3 } from "../endpoint"
import { sleep } from "../utils"
import erc20Abi from "./abis/erc20.json"
import { evmTokenFetchPrice } from "./query"

export * from "./query"
export * from "./utils"

export let evmTokenPrices: any = {}

export function evmTokenContract(address: string) {
  const contract = new evmWeb3.eth.Contract(erc20Abi, address)
  return contract
}

export async function fetchingPrices() {
  return
  while(true) {
    const networks = Object.keys(netConfigs)
    for(const network of networks) {
      const tokenPrice = await evmTokenFetchPrice((netConfigs as any)[network].wNative)
      evmTokenPrices[network] = tokenPrice
    }
    // console.log(`[DAVID] evmTokenPrices :`, evmTokenPrices)
    await sleep(1000)
  }
}