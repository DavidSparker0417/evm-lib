import { evmTrJoeStaking } from ".";
import { evmContractSendTransaction } from "../../contract/common";
import { Web3Account } from "../../types";
import { evmAccount } from "../../wallet";

export async function evmTrJoeStakingDeposit(_signer: Web3Account|string, stakeContract:string, amount: number) {
  const contract = evmTrJoeStaking(stakeContract)
  const signer = evmAccount(_signer)

  const txData = contract.methods.deposit(amount).encodeABI()
  const txHash = await evmContractSendTransaction(signer, stakeContract, txData)
  return txHash
}