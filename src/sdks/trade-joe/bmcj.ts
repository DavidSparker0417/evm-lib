import { Numbers } from "web3";
import { EvmContract, evmErc20Approve } from "../../contract";
import { evmWeb3 } from "../../endpoint";
import { Web3Account } from "../../types";
import abi from "./abis/BoostedMasterChef.json"
import { evmContractSendTransaction } from "../../contract/common";
import { TrJoePoolInfo } from "./types";
import { evmTokenFetchPrice, evmTokenGetBalance, evmTokenGetDecimals } from "../../token";
import { JoePair } from "./v1/joePair";
import BigNumber from "bignumber.js";
import { JoeRouter } from "./v1/router";
import { evmNetConfig } from "../../constants";

export class BMCJ extends EvmContract {
  constructor(addr: string, signer?: Web3Account|string|undefined) {
    super(addr, signer)
    this.contract = new evmWeb3.eth.Contract(abi, addr)
  }

  async poolLength(): Promise<number> {
    return Number(await this.contract.methods.poolLength().call())
  }

  async JOE(): Promise<string> {
    return await this.contract.methods.JOE().call()
  }

  async MASTER_CHEF_V2(): Promise<string> {
    return await this.contract.methods.MASTER_CHEF_V2().call()
  }

  async MASTER_PID(): Promise<number> {
    return Number(await this.contract.methods.MASTER_PID().call())
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
    const joe = await this.JOE()
    const joeDecimal = await evmTokenGetDecimals(joe)
    const joePrice = await evmTokenFetchPrice(joe)
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
    return await this.deposit(pid, 0)
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

  // ------------ operation
  async init(dummyToken: string): Promise<string> {
    await evmErc20Approve(this.signer, dummyToken, this.address)
    const txData = this.contract.methods.init(dummyToken).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async addPool(allocPoint: Numbers, veJoeShareBp: Numbers, lpToken: string, rewarder: string): Promise<string> {
    const txData = this.contract.methods.add(allocPoint, veJoeShareBp, lpToken, rewarder).encodeABI()
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