import { Numbers } from "web3";
import { evmTrJoeLBFactory } from ".";
import { PairInfo } from "./types";
import { ZERO_ADRESS } from "../../constants";
import { EvmContract } from "../../contract";
import { Web3Account } from "../../types";
import { evmWeb3 } from "../../endpoint";
import abi from "../trade-joe/abis/LBFactory.json"
import { evmContractSendTransaction } from "../../contract/common";
import { TrJoeLBPair } from './lbPair';

export class TrJoeFactory extends EvmContract {
  constructor(address: string, signer: Web3Account | string) {
    super(address, signer)
    this.contract = new evmWeb3.eth.Contract(abi, address)
  }

  async getAllPairs(tokenX: string, tokenY: string): Promise<any> {
    return await this.contract.methods.getAllLBPairs(tokenX, tokenY).call()
  }

  async getNumberOfLBPairs(): Promise<any> {
    return await this.contract.methods.getNumberOfLBPairs().call()
  }

  async getLBPairAtIndex(index: Numbers): Promise<any> {
    return await this.contract.methods.getLBPairAtIndex(index).call()
  }

  async getPairInfo(
    tokenX: string,
    tokenY: string,
    binStep: Numbers): Promise<PairInfo> {
    const pairInfo: any = await this.contract.methods.getLBPairInformation(tokenX, tokenY, binStep.toString()).call()
    if (pairInfo.LBPair === ZERO_ADRESS)
      throw new Error(`[DAVID] Error! pair not exist!`)
    const pair = new TrJoeLBPair(pairInfo.LBPair, this.signer)
    return {
      address: pairInfo.LBPair,
      binStep: Number(pairInfo.binStep),
      tokenX, tokenY,
      activeId: await pair.getActiveId()
    }
  }

  async getNumberOfQuoteAssets(): Promise<number> {
    return await this.contract.methods.getNumberOfQuoteAssets().call()
  }

  async createLBPair(tokenX: string, tokenY: string, activeId: Numbers, binStep: Numbers): Promise<string> {
    console.log(`[DAVID] Creating LB Pair...`)
    const txData = this.contract.methods.createLBPair(tokenX, tokenY, activeId, binStep).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async addQuoteAsset(quoteAsset: string): Promise<string> {
    console.log(`[DAVID] Adding quote asset (${quoteAsset}) ...`)
    const txData = this.contract.methods.addQuoteAsset(quoteAsset).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }
}

export async function evmTrJoeFactoryGetPairs(factory: string, tokenX: string, tokenY: string): Promise<any> {
  const contract = evmTrJoeLBFactory(factory)
  const pairs: any = await contract.methods.getAllLBPairs(tokenX, tokenY).call()
  return pairs
}

export async function evmTrJoeFactoryGetPairInfo(
  factory: string,
  tokenX: string,
  tokenY: string,
  binStep: Numbers): Promise<PairInfo> {
  const contract = evmTrJoeLBFactory(factory)
  const pair: any = await contract.methods.getLBPairInformation(tokenX, tokenY, binStep.toString()).call()
  if (pair.LBPair === ZERO_ADRESS)
    throw new Error(`[DAVID] Error! pair not exist!`)
  return {
    address: pair.LBPair,
    binStep: Number(pair.binStep),
    tokenX: tokenX,
    tokenY: tokenY
  }
}