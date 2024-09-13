import { Numbers, Transaction } from "web3";
import { Web3Account } from "../types";
import { evmWeb3 } from "../endpoint";
import { evmTrSendTransaction } from "../transaction";
import { evmWalletGetBalance } from "../wallet";

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
  console.log(`[DAVID](evmContractSendTransaction) gasPrice = ${gasPrice} estGas = ${gasEstimate}`)
  const gasConsumedAmount = evmWeb3.utils.fromWei((gasPrice * gasEstimate).toString(), 'ether')
  console.log(`[DAVID](evmContractSendTransaction) consuming gas =`, gasConsumedAmount)
  const balance = await evmWalletGetBalance(signer.address)
  if (balance < Number(gasConsumedAmount))
    throw new Error('Insufficient balance to pay gas.')
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