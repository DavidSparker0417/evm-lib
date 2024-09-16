import { Contract, ContractAbi } from "web3"
import { Web3Account } from "../types"
import { evmAccount } from "../wallet"

export * from "./erc20"
export * from "./pumpfun"
export * from "./traderjoe"

export class EvmContract {
  public address: string
  public signer: Web3Account
  public contract: Contract<ContractAbi>

  constructor(addr: string, signer: Web3Account|string) {
    this.address = addr
    this.signer = evmAccount(signer)
    this.contract = new Contract([])
  }
}