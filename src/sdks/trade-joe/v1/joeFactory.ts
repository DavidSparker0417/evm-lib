import { EvmContract } from "../../../contract";
import { evmContractSendTransaction } from "../../../contract/common";
import { evmWeb3 } from "../../../endpoint";
import { Web3Account } from "../../../types";
import abi from "./abis/JoeFactory.json"

export class JoeFactory extends EvmContract {
  constructor(addr: string, signer: Web3Account|string|undefined) {
    super(addr, signer)
    this.contract = new evmWeb3.eth.Contract(abi, addr)
  }

  async createPair(tokenA: string, tokenB: string): Promise<string> {
    const txData = this.contract.methods.createPair(tokenA, tokenB).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async getPair(tokenX: string, tokenY: string): Promise<string> {
    return await this.contract.methods.getPair(tokenX, tokenY).call()
  }
}