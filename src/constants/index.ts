import { factory } from "typescript"

export const ZERO_ADRESS = "0x0000000000000000000000000000000000000000"

export const netConfigs = {
  avalanche: {
    rpc: "https://avalanche-c-chain-rpc.publicnode.com",
    wNative: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    usdt: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    aaveToken: "",
    traderJoe: {
      router: "0x18556DA13313f3532c54711497A8FedAC273220E",
      joeToken: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
      joeRouter: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
      MasterChefJoeV2: "0xd6a4F121CA35509aF06A0Be99093d08462f53052",
      bmcj: "0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F",
      factory: "0xb43120c4745967fa9b93E79C149E66B0f2D6Fe0c"
    },
    aave: {
      addressesProvider: ""
    }
  },
  sei_devnet: {
    rpc: "https://evm-rpc.arctic-1.seinetwork.io",
    wNative: "0x57eE725BEeB991c70c53f9642f36755EC6eb2139",
    usdt: "0x702DC8AfCc61d28dA5D8Fd131218fbe8DAF19CeC",
    usdc: "0x702DC8AfCc61d28dA5D8Fd131218fbe8DAF19CeC",
    aaveToken: "",
    traderJoe: {
      router: "0x9D8925eDD38a00EDA66F90a68Efb2dD6E2659bf5",
      bmcj: "0x48be7F950056825BB241348C3Ba3C097852f5378",
      bmcjt: "0x8DfaDcf7e6D3ED9668a14f66077d06068713CaF2",
      sJoeStaking: "0x88EA1cf80DB459182209B871Dc13A6b64Fd183C9",
      joeRouter: "0x8f5b417a070f3BC57A7E135AdC3996A697581B14"
    },
    aave: {
      addressesProvider: ""
    }
  },
  sei_mainnet: {
    rpc: "https://evm-rpc.sei-apis.com",
    wNative: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
    usdt: "0xB75D0B03c06A926e488e2659DF1A861F860bD3d1",
    usdc: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
    aaveToken: "",
    traderJoe: {
      router: "0xFAE073bdF2FaCB05AAFE41D52ccA842c45008170",
      joeToken: "0x555cAE48ce91cAF8C3DE06abC06554d7032815A0",
      MasterChefJoeV2: "0xe50A5Ea575e4A4CCABC65DC2Ae338c9f7E51b9c0",
      factory: "0x672Aa181c0bd9fC713F33C5Aa481412e8777Dc1b",
      joeRouter: "0xFAE073bdF2FaCB05AAFE41D52ccA842c45008170"
    },
    wallets: {
      pk: '0xacE2105ed22234726DEF5321c0757209E0DB8C7A'
    },
    aave: {
      addressesProvider: ""
    }
  },
  bsc_testnet: {
    rpc: "https://data-seed-prebsc-2-s2.bnbchain.org:8545",
    wNative: "0x094616f0bdfb0b526bd735bf66eca0ad254ca81f",
    aave: {
      addressesProvider: ""
    }
  },
  bsc_mainnet: {
    rpc: "https://bsc-dataseed1.ninicoin.io",
    wNative: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    aaveToken: "0xfb6115445Bff7b52FeB98650C87f44907E58f802",
    aave: {
      addressesProvider: "0xA9aD669442f9ABEd99b6B4a803BDae0746FEa220",
      reservesSetupHelper: "0x699ebC4C8d0c4a3fb1721840Ae75EEeA09D1a608",
    }
  }
}

const network = 'sei_devnet'

export const evmNetConfig = netConfigs[network]