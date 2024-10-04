import { Numbers } from "web3";
import { evmTrJoeStaking } from ".";
import { EvmContract } from "../../contract";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from "../../endpoint";
import { evmTokenGetBalance } from "../../token";
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import abi from "./abis/StableJoeStaking.json"

export class TrJoeStableJoeStaking extends EvmContract{
  constructor(addresss:string, signer: Web3Account|string) {
    super(addresss, signer)
    this.contract = new evmWeb3.eth.Contract(abi, addresss)
  }

  // query
  async joe(): Promise<string> {
    return await this.contract.methods.joe().call()
  }

  async rewardTokenCount(): Promise<number> {
    return Number(await this.contract.methods.rewardTokensLength().call())
  }

  async getRewardToken(id: Numbers): Promise<string> {
    return await this.contract.methods.rewardTokens(id).call()
  }
  
  async rewardTokens(): Promise<string[]> {
    const count = await this.rewardTokenCount()
    const rTokens: string[] = []
    for(let i = 0; i < count; i ++) {
      rTokens.push(await this.getRewardToken(i))
    }
    return rTokens
  }

  async pendingReward(user: string, token: string): Promise<Numbers> {
    return await this.contract.methods.pendingReward(user, token).call()
  }

  async getStaked(user: string, rewardToken: string): Promise<Numbers> {
    const userInfo:any = await this.contract.methods.getUserInfo(user, rewardToken)
    return userInfo.amount
  }

  // user operations
  async deposit(amount: Numbers): Promise<string> {
    const txData = this.contract.methods.deposit(amount).encodeABI()
    const txHash = await evmContractSendTransaction(this.signer, this.address, txData)
    return txHash
  }

  async withdraw(_amount?: Numbers|undefined): Promise<string> {
    let amount = _amount
    if (amount === undefined) {
      const rewardToken = await this.getRewardToken(0)
      amount = await this.getStaked(this.signer.address, rewardToken)
    }
    const txData = this.contract.methods.withdraw(amount).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async harvest(): Promise<string> {
    return this.withdraw(0)
  }

  // admin operations
  async removeRewardToken(token: string): Promise<string> {
    const txData = this.contract.methods.removeRewardToken(token).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async addRewardToken(token: string): Promise<string> {
    const txData = this.contract.methods.addRewardToken(token).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }
}

