import { Numbers } from "web3";
import { EvmContract } from "../../contract";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from "../../endpoint";
import { Web3Account } from "../../types";
import abi from "./abis/PoolConfigurator.json"

export class AAVE_PoolConfigurator extends EvmContract {
  constructor(address: string, signer: Web3Account|string) {
    super(address, signer)
    this.contract = new evmWeb3.eth.Contract(abi, address)
  }

  async setBorrowableInIsolation(address: string, borrowable: boolean): Promise<string> {
    const txData = this.contract.methods.setBorrowableInIsolation(address, borrowable).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async updateAToken(asset: string, treasury: string, incentivesController: string, name: string, symbol: string, implementation: string, params: any): Promise<string> {
    const txData = this.contract.methods.updateAToken({
      asset, treasury, incentivesController, name, symbol, implementation, params
    }).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async setDebtCeiling(asset: string, debtCeiling: Numbers): Promise<string> {
    const txData = this.contract.methods.setDebtCeiling(asset, debtCeiling).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }
}