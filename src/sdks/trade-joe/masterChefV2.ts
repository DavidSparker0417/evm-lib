import { Contract, ContractAbi, Numbers } from "web3"
import abi from "./abis/MasterChefV2.json"
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from '../../endpoint/index';
import { TrJoePoolInfo, FarmUserInfo } from './types';
import { TrJoeLBPair } from './lbPair';
import { JoeRouter } from "./v1/router";
import { evmNetConfig } from "../../constants";
import { EvmContract } from "../../contract";
import BigNumber from "bignumber.js";
import { evmTokenFetchPrice, evmTokenGetBalance, evmTokenGetDecimals } from "../../token";
import { JoePair } from "./v1/joePair";

export class TrJoeMasterChefV2 extends EvmContract {

  constructor(contractAddr: string, signer: Web3Account | string | undefined = undefined) {
    super(contractAddr, signer)
    this.contract = new evmWeb3.eth.Contract(abi, contractAddr)
  }

  async joe(): Promise<string> {
    return await this.contract.methods.joe().call()
  }

  async joePerSec(): Promise<Numbers> {
    return await this.contract.methods.joePerSec().call()
  }

  async totalAllocPoint(): Promise<Numbers> {
    return await this.contract.methods.totalAllocPoint().call()
  }

  async deposit(pid: Numbers, amount: Numbers): Promise<string> {
    const data = this.contract.methods.deposit(pid, amount).encodeABI()
    return await evmContractSendTransaction(this.signer as Web3Account, this.address, data)
  }

  async poolLength(): Promise<number> {
    return Number(await this.contract.methods.poolLength().call())
  }

  async _poolInfo(pid: Numbers): Promise<any> {
    return await this.contract.methods.poolInfo(pid).call()
  }

  async poolInfo(pid: Numbers): Promise<TrJoePoolInfo> {
    const poolInfo: any = await this.contract.methods.poolInfo(pid).call()
    const [_, amount] = await evmTokenGetBalance(this.address, poolInfo.lpToken)
    const lpTokenAddr = poolInfo.lpToken
    const lpToken = new JoePair(lpTokenAddr, this.signer)
    const lpSummary:any = await lpToken.summary()
    const liquidity = Number(new BigNumber(amount.toString()).multipliedBy(BigNumber(lpSummary.liquidity)).dividedBy(BigNumber(lpSummary.totalSupply)))
    const joe = await this.joe()
    const joeDecimal = await evmTokenGetDecimals(joe)
    const joePrice = 0.32//await evmTokenFetchPrice(joe)
    const annualReward = Number(await this.joePerSec()) * 86400 * 365 * joePrice
    const annRd = Number(evmWeb3.utils.fromWei(Math.floor(annualReward), joeDecimal))
    const apr = (annRd * 100)/liquidity
    return {
      tokenX: lpSummary.tokenX,
      tokenY: lpSummary.tokenY,
      liquidity,
      apr,
      lpToken: lpTokenAddr,
      amount
    }
  }

  async userInfo(pid: Numbers, user: string): Promise<any> {
    const uInfo: any = await this.contract.methods.userInfo(pid, user).call()
    const poolInfo = await this._poolInfo(pid)
    const reward: BigNumber = (new BigNumber(uInfo.amount.toString())).multipliedBy(poolInfo.accJoePerShare).minus(uInfo.rewardDebt.toString())
    return {
      amount: uInfo.amount,
      reward: reward.toString()
    }
  }

  async pendingTokens(pid: Numbers, userAddr: string): Promise<Numbers> {
    const pendingInfo:any = await this.contract.methods.pendingTokens(pid, userAddr).call()
    return pendingInfo.pendingJoe
  }

  async withdraw(pid: Numbers, _amount?: Numbers): Promise<string> {
    let amount = _amount
    if (amount === undefined)
    {
      const uInfo = await this.userInfo(pid, this.signer.address)
      amount = uInfo.amount
    }
    const txData = this.contract.methods.withdraw(pid, amount).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async harvest(pid: Numbers): Promise<string> {
    return await this.withdraw(pid, 0)
  }

  async getPoolList(): Promise<TrJoePoolInfo[]> {
    const poolCount = await this.poolLength()
    const poolList: TrJoePoolInfo[] = []
    for (let pid = 0; pid < poolCount; pid++) {
      const pool = await this.poolInfo(pid)
      poolList.push(pool)
    }
    return poolList
  }

  async addPool(allocPoint: Numbers, lpToken: string, rewarder: string): Promise<string> {
    const txData = this.contract.methods.add(allocPoint, lpToken, rewarder).encodeABI()
    return await evmContractSendTransaction(this.signer as Web3Account, this.address, txData)
  }

  async set(pid: number, allocPoint: Numbers, rewarder: string, overwrite: boolean): Promise<string> {
    const txData = this.contract.methods.set(pid, allocPoint, rewarder, overwrite).encodeABI()
    return await evmContractSendTransaction(this.signer as Web3Account, this.address, txData)
  }

  async findPoolId(tokenX: string, tokenY: string): Promise<number> {
    const router = new JoeRouter(evmNetConfig.traderJoe.joeRouter, this.signer)
    const targetLp = await router.getPair(tokenX, tokenY)
    const poolCount = await this.poolLength()
    for(let i = 0; i < poolCount; i ++) {
      const poolInfo = await this._poolInfo(i)
      if (poolInfo.lpToken.toLowerCase() === targetLp.toLowerCase())
        return i
    }
    return -1
  }
}