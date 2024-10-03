import { Numbers } from "web3";
import { EvmContract } from "../../contract";
import { evmWeb3 } from "../../endpoint";
import { Web3Account } from "../../types";
import abi from "./abis/pool.json"
import { evmContractSendTransaction } from "../../contract/common";
import { decodeReserveConfigurationMap } from "./helper";

export class AAVE_Pool extends EvmContract {
  constructor(address: string, signer: Web3Account|string|undefined) {
    super(address, signer)
    this.contract = new evmWeb3.eth.Contract(abi, address)
  }

  async getConfiguration(asset: string): Promise<any> {
    const configuration:any = await this.contract.methods.getConfiguration(asset).call()
    return decodeReserveConfigurationMap(configuration.data)
  }

  async setConfiguration(asset: string, configuration: Numbers): Promise<string> {
    const txData = this.contract.methods.setConfiguration(asset, {data: configuration}).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async getReserveData(asset: string): Promise<any> {
    return await this.contract.methods.getReserveData(asset).call()
  }
}