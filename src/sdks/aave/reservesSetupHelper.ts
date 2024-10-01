import { EvmContract } from "../../contract";
import { evmWeb3 } from "../../endpoint";
import { Web3Account } from "../../types";
import abi from "./abis/reservesSetupHelper.json"

export class AAVE_ReservesSetupHelper extends EvmContract {
  constructor(address: string, signer: Web3Account|string) {
    super(address, signer)
    this.contract = new evmWeb3.eth.Contract(abi, address)
  }
}