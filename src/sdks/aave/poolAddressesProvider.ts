import { EvmContract } from "../../contract";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from "../../endpoint";
import { Web3Account } from "../../types";
import abi from "./abis/poolAddressesProvider.json"
import { toBytes32 } from "./helper";

export class AAVE_PoolAddressesProvider extends EvmContract {
  constructor(address: string, signer: Web3Account|string) {
    super(address, signer)
    this.contract = new evmWeb3.eth.Contract(abi, address)
  }

  async getPool(): Promise<string> {
    return await this.contract.methods.getPool().call()
  }

  async getAddress(id: string) {
    return await this.contract.methods.getAddress(toBytes32(id)).call()
  }

  async setAddress(id: string, newAddress: string): Promise<string> {
    const txData = this.contract.methods.setAddress(toBytes32(id), newAddress).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async getPoolConfigurator(): Promise<string> {
    return await this.contract.methods.getPoolConfigurator().call()
  }
}