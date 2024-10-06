import axios from "axios"

export async function dexScreenerTokenPrice(tokenAddress: string): Promise<number> {
  const url = `https://api.dexscreener.io/latest/dex/tokens/${tokenAddress}`;
  try {
    const response = await axios.get(url);
    const pairs: any[] = response.data.pairs;
    const pair = pairs.find((p:any) => p.baseToken.address.toLowerCase() === tokenAddress.toLowerCase())
    // console.log(`[DAVID](SOL-LIB)(3RD-PARY)(dexscreener)(dexScreenerTokenPrice) data: `, JSON.stringify(pairs))
    console.log(`[DAVID](SOL-LIB)(3RD-PARY)(dexscreener)(dexScreenerTokenPrice) price: `, pair.priceUsd)
    return Number(pair.priceUsd)
  } catch (error) {
    // console.log(`[DAVID](SOL-LIB)(3RD-PARY)(dexscreener)(solDexscrGetPairAddr) error: `, error)
    return 0;
  }
}