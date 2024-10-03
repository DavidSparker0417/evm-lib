import { Numbers } from "web3"
import { evmTokenContract } from "."
import { evmWeb3 } from "../endpoint"

export async function evmTokenGetBalance(who: string, token: string): Promise<[number, Numbers]> {
  const contract = evmTokenContract(token)
  if (!contract)
    return [0, 0]
  
  const balance:Numbers = await contract.methods.balanceOf(who).call()
  const decimals:Numbers = await contract.methods.decimals().call()
  // console.log(decimals)

  const balanceInNumber = Number(evmWeb3.utils.fromWei(balance, Number(decimals)))
  return [balanceInNumber, balance]
}

export async function evmTokenGetDecimals(token: string): Promise<number> {
  const contract = evmTokenContract(token)
  if (!contract)
    return 0
  const decimals = Number(await contract.methods.decimals().call())
  return decimals
}

export async function evmTokenGetSymbol(token: string): Promise<string> {
  const contract = evmTokenContract(token)
  if (!contract)
    return ''
  const symbol:string = await contract.methods.symbol().call()
  return symbol
}

export async function evmTokenTotalSupply(token: string): Promise<Numbers> {
  const contract = evmTokenContract(token)

  const totalSup:Numbers = await contract.methods.totalSupply().call()
  return totalSup
}

