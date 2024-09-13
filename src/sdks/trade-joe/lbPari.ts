import { Contract, ContractAbi, Numbers } from "web3"
import abi from "./abis/LBPair.json"
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from '../../endpoint/index';
import { TrJoePoolInfo } from "./types";

export class evmTrJoeLBPair {
  
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

  async getActiveId(): Promise<string> {
    return await this.contract.methods.getActiveId().call()
  }
}