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
      router: "0xe20e58B747bC1E9753DF595D19001B366f49A78D",
      joeToken: "0x9C178e5771BF5402888ac9B637B95f7F1cA7b66D",
      MasterChefJoeV2: "0xFF418410053701626430d7c0AAd8207d6Ea6C800",
      factory: "0x8331B3EaDd81b00AA2bAD2f7F338010279b242dE",
      sJoeStaking: "0xacf3eC6DDf5E74f0e864A01B0cBa336ac0CdB9cC"
    }
  },
  sei_mainnet: {
    rpc: "https://evm-rpc.sei-apis.com",
    wNative: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
    usdt: "",
    usdc: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
    traderJoe: {
      router: "0x1dcE3231C4eCC9E4C09c83BF02D0c5816A60649D",
      joeToken: "0xdDB63C3576aE64aec4B6c04d1c1418CB6368Ad67",
      masterChefV2: "0x867A553146BFe10bC8B5761d1B600f76d00a5038",
      factory: "0x9F8C4ceE925A99A293fd0941C18dE3e5d6471967"
    },
    wallets: {
      pk: '0xacE2105ed22234726DEF5321c0757209E0DB8C7A'
    }
  },
}

const network = 'sei_devnet'

export const evmNetConfig = netConfigs[network]