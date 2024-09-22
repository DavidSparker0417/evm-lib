import { Transaction } from "web3"
import { evmWeb3 } from "../endpoint"
import { Web3Account } from "../types"
import { evmWalletGetBalance, evmWalletImport } from "../wallet"
import { sleep } from "../utils"

export async function evmTrWaitReceipt(txHash: string) {
  while (true) {
    const receipt = await evmWeb3.eth.getTransactionReceipt(txHash)
    if (receipt)
      return receipt
    await sleep(2000)
  }
}

export async function evmTrSendTransaction(_sender: Web3Account | string, transaction: Transaction): Promise<string> {
  const sender: Web3Account = typeof _sender === "string" ? evmWalletImport(_sender) : _sender
  const signedTx = await evmWeb3.eth.accounts.signTransaction(transaction, sender.privateKey)
  const receipt = await evmWeb3.eth.sendSignedTransaction(signedTx.rawTransaction || '');
  await evmTrWaitReceipt(receipt.transactionHash.toString())
  return receipt.transactionHash.toString()
}

export async function evmTrBuildTransferNative(sender: string, receiver: string, amount: number | undefined): Promise<Transaction | undefined> {

  let gasPrice = await evmWeb3.eth.getGasPrice()
  let gasLimit = 21000

  // increase gas price
  gasPrice = (BigInt(gasPrice) * BigInt(1125)) / BigInt(1000);

  let amountInWei: BigInt
  if (amount)
    amountInWei = BigInt(evmWeb3.utils.toWei(amount.toString(), 'ether'))
  else {
    const walletBalance = BigInt(await evmWeb3.eth.getBalance(sender))

    const estGasLimit = await evmWeb3.eth.estimateGas({
      from: sender,
      to: receiver,
      value: walletBalance.toString()
    });

    const gasCost = BigInt(estGasLimit) * gasPrice;
    if (walletBalance < gasCost)
      return undefined

    gasLimit = Number(estGasLimit)
    amountInWei = walletBalance - gasCost

    const totalCost = BigInt(amountInWei.toString()) + (BigInt(gasLimit) * gasPrice);
    console.log(`[DAVID] building all withdraw tr: balance = ${walletBalance}, gasCost = ${gasCost}, amountInWei = ${amountInWei}, totalCost=${totalCost}`)
    if (walletBalance < totalCost) {
      console.error(`[DAVID] Insufficient funds: Wallet balance (${walletBalance}) < Total cost (${totalCost})`);
      return undefined
    }
    amountInWei = BigInt(amountInWei.toString()) - BigInt(evmWeb3.utils.toWei("0.00000001", "ether"))
  }

  console.log(`[DAVID](evmTrBuildTransferNative) gasLimit:${gasLimit}, gasPrice:${gasPrice}`)
  const nonce = await evmWeb3.eth.getTransactionCount(sender)
  const tx: Transaction = {
    from: sender,
    to: receiver,
    value: amountInWei.toString(),
    gas: gasLimit,
    gasPrice: gasPrice.toString(),
    nonce
  }
  return tx
}
