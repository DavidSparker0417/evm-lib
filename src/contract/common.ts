import { Numbers, Transaction } from "web3";
import { Web3Account } from "../types";
import { evmWeb3 } from "../endpoint";
import { evmTrSendTransaction } from "../transaction";

export async function evmContractSendTransaction(
  signer: Web3Account, 
  contractAddr: string,
  callData: any,
  value: Numbers = "0"
) {

  const gasEstimate = await evmWeb3.eth.estimateGas(
    {
      from: signer.address,
      to: contractAddr,
      data: callData,
      value
    })

  let gasPrice = await evmWeb3.eth.getGasPrice()
  gasPrice = (BigInt(gasPrice) * BigInt(1125)) / BigInt(1000);
  const tx:Transaction = {
    from: signer.address,
    to: contractAddr,
    gas: gasEstimate,
    gasPrice,
    data: callData,
    value
  }
  return await evmTrSendTransaction(signer, tx)
}