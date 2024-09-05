import { HexString } from "web3";

export interface Web3Account {
  address: HexString;
  privateKey: HexString;
}
