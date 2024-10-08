import { HexString } from "web3";

export interface Web3Account {
  address: HexString;
  privateKey: HexString;
}

export interface TokenMeta {
  name: string,
  symbol: string,
  decimals: number
}

export interface NetConfig {}