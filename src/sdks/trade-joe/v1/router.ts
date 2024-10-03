import { EvmContract } from "../../../contract";
import abi from "./abis/JoeRouter.json"
import { signer } from '../../../test/index';
import { Web3Account } from "../../../types";
import { evmWeb3 } from "../../../endpoint";
import { Numbers } from "web3";
import { evmContractSendTransaction } from "../../../contract/common";

export class JoeRouter extends EvmContract {
  constructor(addr: string, signer: Web3Account|string|undefined) {
    super(addr, signer)
    this.contract = new evmWeb3.eth.Contract(abi, addr)
  }

  async wNative(): Promise<string> {
    return await this.contract.methods.WAVAX().call()
  }

  async addLiquidity(tokenA: string, tokenB: string, amountADesired: Numbers, amountBDesired: Numbers, amountAMin: Numbers, amountBMin: Numbers, to: string, deadline?: Numbers):Promise<string> {
    if (!deadline)
      deadline = Math.floor(new Date().getTime() / 1000) + 3600
    const txData = this.contract.methods.addLiquidity(
      tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline
    ).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }

  async addLiquidityNative(token: string, amountTokenDesired: Numbers, amountTokenMin: Numbers, amountAvaxMin: Numbers, to: string, deadline?: Numbers): Promise<string> {
    if (!deadline)
      deadline = Math.floor(new Date().getTime() / 1000) + 3600
    const txData = this.contract.methods.addLiquidityAVAX(token, amountTokenDesired, amountTokenMin, amountAvaxMin, to, deadline).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData, amountAvaxMin)
  }

  async swapTokensForExactAVAX(amountOut: Numbers, amountInMax: Numbers, path: string[], to: string, dealine: Numbers):Promise<string> {
    const txData = this.contract.methods.swapTokensForExactAVAX(
      amountOut, amountInMax, path, to, dealine
    ).encodeABI()
    return await evmContractSendTransaction(this.signer, this.address, txData)
  }
}