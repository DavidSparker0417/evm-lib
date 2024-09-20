import { evmTrJoeStaking } from ".";
import { EvmContract } from "../../contract";
import { evmContractSendTransaction } from "../../contract/common";
import { evmWeb3 } from "../../endpoint";
import { evmTokenGetBalance } from "../../token";
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";
import abi from "./abis/StableJoeStaking.json"

export class TrJoeStableJoeStaking extends EvmContract{
  constructor(addresss:string, signer: Web3Account|string) {
    super(addresss, signer)
    this.contract = new evmWeb3.eth.Contract(abi, addresss)
  }

  async deposit(amount: number): Promise<string> {
    const txData = this.contract.methods.deposit(amount).encodeABI()
    const txHash = await evmContractSendTransaction(this.signer, this.address, txData)
    return txHash
  }
}

