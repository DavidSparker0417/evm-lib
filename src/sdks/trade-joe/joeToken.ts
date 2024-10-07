import { Numbers } from 'web3';
import { signer } from '../../test/index';
import { Web3Account } from '../../types';
import { evmAccount } from '../../wallet';
import { evmTrJoeToken } from '.';
import { evmContractSendTransaction } from '../../contract/common';

export async function evmTrJoeTokenMint(_signer: Web3Account | string, tokenAddr: string, amount: Numbers, to: string | undefined = undefined): Promise<string> {
  const signer = evmAccount(_signer)
  const contract = evmTrJoeToken(tokenAddr)

  const data = contract.methods.mint(
    to || signer.address,
    amount).encodeABI()

  return await evmContractSendTransaction(signer, tokenAddr, data)
}