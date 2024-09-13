import { Contract, ContractAbi, Numbers } from "web3"
import abi from "./abis/MasterChefV2.json"
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from '../../endpoint/index';
import { TrJoePoolInfo } from "./types";

export class evmTrJoeMasterChefV2 {
  
  private contract: Contract<ContractAbi>
  private signer: Web3Account|undefined
  private address: string
  
  constructor(contractAddr: string, signer:Web3Account|string|undefined = undefined) {
    this.address = contractAddr
    this.contract = new evmWeb3.eth.Contract(abi, contractAddr)
    this.signer = signer ? evmAccount(signer) : undefined
  }

  // deposit lp token
  async deposit(pid: Numbers, amount: Numbers): Promise<string> {
    const data = this.contract.methods.deposit(pid, amount).encodeABI()
    return await evmContractSendTransaction(this.signer as Web3Account, this.address, data)
  }

  async poolLength(): Promise<number> {
    return Number(await this.contract.methods.poolLength().call())
  }

  async poolInfo(pid: Numbers): Promise<TrJoePoolInfo> {
    const poolInfo:any = await this.contract.methods.poolInfo(pid).call()
    return {
      lpToken: poolInfo.lpToken,
      allocPoint: Number(poolInfo.allocPoint),
      lastRewardTimestamp: Number(poolInfo.lastRewardTimestamp),
      accJoePerShare: Number(poolInfo.accJoePerShare),
      rewarder: poolInfo.rewarder
    }
  }
}