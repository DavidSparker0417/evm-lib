import { Numbers } from "web3";
import { evmTrJoeLBFactory } from ".";
import { PairInfo } from "./types";
import { ZERO_ADRESS } from "../../constants";

export async function evmTrJoeFactoryGetPairs(factory: string, tokenX: string, tokenY: string): Promise<any> {
  const contract = evmTrJoeLBFactory(factory)
  const pairs:any = await contract.methods.getAllLBPairs(tokenX, tokenY).call()
  return pairs
}

export async function evmTrJoeFactoryGetPairInfo(
  factory: string, 
  tokenX: string, 
  tokenY: string, 
  binStep: Numbers): Promise<PairInfo> {
  const contract = evmTrJoeLBFactory(factory)
  const pair:any = await contract.methods.getLBPairInformation(tokenX, tokenY, binStep.toString()).call()
  if (pair.LBPair === ZERO_ADRESS)
    throw new Error(`[DAVID] Error! pair not exist!`)
  return {
    address: pair.LBPair,
    binStep: Number(pair.binStep)
  }
}