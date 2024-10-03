import { factory } from "typescript"

export const ZERO_ADRESS = "0x0000000000000000000000000000000000000000"

const netConfigs = {
  avalanche: {
    rpc: "https://avalanche-c-chain-rpc.publicnode.com",
    wNative: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    usdt: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    traderJoe: {
      router: "0x18556DA13313f3532c54711497A8FedAC273220E",
      joeToken: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
      MasterChefJoeV2: "0xd6a4F121CA35509aF06A0Be99093d08462f53052",
      factory: "0xb43120c4745967fa9b93E79C149E66B0f2D6Fe0c"
    }
  },
  sei_devnet: {
    rpc: "https://evm-rpc.arctic-1.seinetwork.io",
    wNative: "0x57eE725BEeB991c70c53f9642f36755EC6eb2139",
    usdt: "0x702DC8AfCc61d28dA5D8Fd131218fbe8DAF19CeC",
    usdc: "0x702DC8AfCc61d28dA5D8Fd131218fbe8DAF19CeC",
    traderJoe: {
      router: "0x9D8925eDD38a00EDA66F90a68Efb2dD6E2659bf5",
      joeToken: "0xF816cDa127AD3C8355856734788fb3cC55194fB7",
      MasterChefJoeV2: "0x44940F9cf5Af0B539Ecf83debcf09a4d0fdd7cCE",
      sJoeStaking: "0x671f8E4EB38928730925cf64952A1DF7bc7b855A",
      joeRouter: "0x5634A5B62d6bdA85a3167B373BDDceD6523093f8"
    }
  },
  sei_mainnet: {
    rpc: "https://evm-rpc.sei-apis.com",
    wNative: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
    usdt: "0xB75D0B03c06A926e488e2659DF1A861F860bD3d1",
    usdc: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
    traderJoe: {
      router: "0xFAE073bdF2FaCB05AAFE41D52ccA842c45008170",
      joeToken: "0x555cAE48ce91cAF8C3DE06abC06554d7032815A0",
      MasterChefJoeV2: "0xe50A5Ea575e4A4CCABC65DC2Ae338c9f7E51b9c0",
      factory: "0x672Aa181c0bd9fC713F33C5Aa481412e8777Dc1b",
      joeRouter: "0xFAE073bdF2FaCB05AAFE41D52ccA842c45008170"
    },
    wallets: {
      pk: '0xacE2105ed22234726DEF5321c0757209E0DB8C7A'
    }
  },
  bsc_testnet: {
    rpc: "https://data-seed-prebsc-2-s2.bnbchain.org:8545"
  },
  bsc_mainnet: {
    rpc: "https://bsc-dataseed1.ninicoin.io",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    aaveToken: "0xfb6115445Bff7b52FeB98650C87f44907E58f802",
    aave: {
      addressesProvider: "0xA9aD669442f9ABEd99b6B4a803BDae0746FEa220",
      reservesSetupHelper: "0x699ebC4C8d0c4a3fb1721840Ae75EEeA09D1a608",
    }
  }
}

const network = 'sei_mainnet'

export const evmNetConfig = netConfigs[network]