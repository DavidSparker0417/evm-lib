import { EvmContract } from "../../contract";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from "../../endpoint";
import { Web3Account } from "../../types";
import abi from "./abis/AaveOracle.json"

export class AaveOracle extends EvmContract {
  constructor(addr: string, signer: Web3Account|string|undefined) {
    super(addr, signer)
    this.contract = new evmWeb3.eth.Contract(abi, addr)
  }

  async getAssetPrice(asset: string): Promise<string> {
    return await this.contract.methods.getAssetPrice(asset).call()
  }

  async setAssetSources(assets: string[], sources: string[]): Promise<string> {
    const txData = this.contract.methods.setAssetSources(assets, sources).encodeABI();
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }
}