import { Numbers } from "web3";
import { EvmContract } from "../../../contract";
import { evmWeb3 } from "../../../endpoint";
import { Web3Account } from "../../../types";
import abi from "./abis/JoePair.json"
import { evmTokenFetchPrice, evmTokenGetDecimals } from "../../../token";

export class JoePair extends EvmContract {
  constructor(address: string, signer?: Web3Account|string|undefined) {
    super(address, signer)
    this.contract = new evmWeb3.eth.Contract(abi, address)
  }

  async token0(): Promise<string> {
    return await this.contract.methods.token0().call()
  }

  async token1(): Promise<string> {
    return await this.contract.methods.token1().call()
  }

  async getReserves(): Promise<any[]> {
    return await this.contract.methods.getReserves().call()
  }

  async totalSupply(): Promise<Numbers> {
    return await this.contract.methods.totalSupply().call()
  }

  async liquidity(): Promise<number> {
    const tokenX = await this.token0()
    const tokenY = await this.token1()
    const priceX = await evmTokenFetchPrice(tokenX)
    const priceY = await evmTokenFetchPrice(tokenY)
    let liqX = 0
    let liqY = 0
    const [amountX, amountY] = await this.getReserves()
    if (priceX) {
      const decimals = await evmTokenGetDecimals(tokenX)
      const amount = Number(evmWeb3.utils.fromWei(amountX, decimals))
      liqX = amount * priceX
    }
    if (priceY) {
      const decimals = await evmTokenGetDecimals(tokenY)
      const amount = Number(evmWeb3.utils.fromWei(amountY, decimals))
      liqY = amount * priceY
    }

    let liquidity = 0
    if (liqX && liqY)
      liquidity = liqX + liqY
    else 
      liquidity = (liqX + liqY) * 2
    return liquidity
  }

  async summary(): Promise<any> {
    const tokenX = await this.token0()
    const tokenY = await this.token1()
    const priceX = 0; //await evmTokenFetchPrice(tokenX)
    const priceY = await evmTokenFetchPrice(tokenY)
    let liqX = 0
    let liqY = 0
    const {_reserve0: amountX, _reserve1: amountY} = (await this.getReserves()) as any
    if (priceX) {
      const decimals = await evmTokenGetDecimals(tokenX)
      const amount = Number(evmWeb3.utils.fromWei(amountX, decimals))
      liqX = amount * priceX
    }
    if (priceY) {
      const decimals = await evmTokenGetDecimals(tokenY)
      const amount = Number(evmWeb3.utils.fromWei(amountY, decimals))
      liqY = amount * priceY
    }
    
    let liquidity = 0
    if (liqX && liqY)
      liquidity = liqX + liqY
    else 
      liquidity = (liqX + liqY) * 2

    return {
      tokenX: {
        address: tokenX,
        amount: amountX,
      },
      tokenY: {
        address: tokenY,
        amount: amountY,
      },
      liquidity,
      totalSupply: await this.totalSupply()
    }
  }
}