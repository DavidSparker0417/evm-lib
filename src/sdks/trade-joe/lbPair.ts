import { Contract, ContractAbi, Numbers } from "web3"
import abi from "./abis/LBPair.json"
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from '../../endpoint/index';
import { TrJoePoolInfo } from "./types";

export class TrJoeLBPair {
  
  private contract: Contract<ContractAbi>
  private signer: Web3Account|undefined
  private address: string
  
  constructor(contractAddr: string, signer:Web3Account|string|undefined = undefined) {
    this.address = contractAddr
    this.contract = new evmWeb3.eth.Contract(abi, contractAddr)
    this.signer = signer ? evmAccount(signer) : undefined
  }

  async getTokenX(): Promise<string> {
    return await this.contract.methods.getTokenX().call()
  }

  async getTokenY(): Promise<string> {
    return await this.contract.methods.getTokenY().call()
  }

  async getActiveId(): Promise<string> {
    return await this.contract.methods.getActiveId().call()
  }

  async getBinStep(): Promise<string> {
    return await this.contract.methods.getBinStep().call()
  }

  async getReserves(): Promise<Numbers[]> {
    return await this.contract.methods.getReserves().call()
  }
  async balanceOf(address: string, id: Numbers): Promise<Numbers> {
    return await this.contract.methods.balanceOf(address, id).call()
  }
}