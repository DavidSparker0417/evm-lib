import { Web3Account } from "../types";
import { evmAccount } from "../wallet";
import { ERC20Details } from "./erc20";
import curveAbi from "./abis/pumpfun.json"
import { evmWeb3 } from "../endpoint";
import { Numbers, Transaction } from "web3";
import { evmContractSendTransaction } from "./common";

let curveContract: any = undefined
const tokenDecimals = 18
const FEE_CREATE = 0.001    // eth
const CURVE_SWAP_FEE = 0.01 // percent

export function evmPFCurveContract(bc: string) {
  if (curveContract)
    return curveContract
  curveContract = new evmWeb3.eth.Contract(curveAbi, bc)
  return curveContract
}

export async function evmPFCreateToken(
  _creator: string | Web3Account, 
  bc: string, 
  meta: ERC20Details, 
  amountMin: Numbers,
  ethAmount: Numbers
): Promise<string> {
  const creator = evmAccount(_creator)
  const contract = evmPFCurveContract(bc)
  if (!contract)
    return ''

  const data = contract.methods.createCurve(
    meta.name,
    meta.symbol,
    meta.logo || '',
    evmWeb3.utils.toWei(amountMin, tokenDecimals),
    amountMin,
    meta.desc || '',
    meta.twitter || '',
    meta.telegram || '',
    meta.website || ''
  ).encodeABI()

  const txHash = await evmContractSendTransaction(creator, bc, data, ethAmount)
  console.log(`[DAVID](evmPFCreateToken) txHash =`, txHash)
  return txHash
}

export async function evmPFCalcAmountTokenForNative(bc: string, token: string, ethAmount: number): Promise<Numbers> {
  const contract = evmPFCurveContract(bc)
  if (!contract)
    return 0
  const estTokenAmount = await contract.methods.getAmountOutToken(
    evmWeb3.utils.toWei(ethAmount, 'ether').toString(),
    token
  ).call()
  console.log(`[DAVID](evmPFBuy) estTokenAmount :`, estTokenAmount)
  return estTokenAmount
}

export async function evmPFCalcAmountEthForToken(bc: string, token: string, tokenAmount: Numbers): Promise<Numbers> {
  const contract = evmPFCurveContract(bc)
  if (!contract)
    return 0
  const estEthAmount = await contract.methods.getAmountOutETH(
    tokenAmount,
    token
  ).call()
  console.log(`[DAVID](evmPFBuy) estNativeAmount :`, estEthAmount.deltaL)
  return estEthAmount.deltaL
}

export async function evmPFBuy(
  _buyer: string | Web3Account,
  bc: string,
  token: string,
  tokenAmount: Numbers,
  ethAmount: Numbers,
  deadline: number = 60
): Promise<string> {
  const buyer = evmAccount(_buyer)
  const contract = evmPFCurveContract(bc)
  if (!contract)
    return ''

  // const tokenCount = await contract.methods.allTokensLength().call()
  // console.log(`[DAVID](evmPFBuy) allTokens :`, tokenCount)
  // const token1 = await contract.methods.allTokens(1).call()
  // const curveInfo = await contract.methods.curveInfo(token1).call()
  // console.log(`[DAVID](evmPFBuy) curvInfo :`, curveInfo)

  const data = contract.methods.buy(
    token,
    tokenAmount,
    Math.floor(Date.now() / 1000 + deadline),
  ).encodeABI()

  const txHash = await evmContractSendTransaction(
    buyer,
    bc,
    data,
    ethAmount)

  console.log(`[DAVID](evmPFBuy) txHash =`, txHash)
  return txHash
}

export async function evmPFSell(
  _seller: string | Web3Account,
  bc: string,
  token: string,
  tokenAmount: Numbers,
  ethAmount: Numbers,
  deadline: number = 60
): Promise<string> {
  const seller = evmAccount(_seller)
  const contract = evmPFCurveContract(bc)
  if (!contract)
    return ''

  const data = contract.methods.sell(
    token,
    tokenAmount,
    ethAmount,
    Math.floor(Date.now() / 1000 + deadline),
  ).encodeABI()

  const txHash = await evmContractSendTransaction(seller, bc, data)
  console.log(`[DAVID](evmPFSell) txHash =`, txHash)
  return txHash
}
