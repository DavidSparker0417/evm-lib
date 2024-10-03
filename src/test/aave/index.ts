import { signer } from "..";
import { evmNetConfig } from "../../constants";
import { decodeReserveConfigurationMap, encodeReserveConfigurationMap } from '../../sdks/aave/helper';
import { AaveOracle } from "../../sdks/aave/oracle";
import { AAVE_Pool } from "../../sdks/aave/pool";
import { AAVE_PoolAddressesProvider } from "../../sdks/aave/poolAddressesProvider";
import { AAVE_PoolConfigurator } from "../../sdks/aave/poolConfigurator";
import { evmTokenGetBalance, evmTokenTotalSupply } from "../../token";

async function aaveFetching() {
  const addrProvider = new AAVE_PoolAddressesProvider(evmNetConfig.aave.addressesProvider, signer)
  const poolAddr = await addrProvider.getPool()
  const pool = new AAVE_Pool(poolAddr, signer)

  console.log(await pool.getReserveData(evmNetConfig.aaveToken))
}

export async function aaveTest() {
  const addrProvider = new AAVE_PoolAddressesProvider(evmNetConfig.aave.addressesProvider, signer)
  const poolAddr = await addrProvider.getPool()
  const pool = new AAVE_Pool(poolAddr, signer)
  // ******* set isolation mode
  const poolConfiguratorAddr = await addrProvider.getPoolConfigurator()
  const poolConfigurator = new AAVE_PoolConfigurator(poolConfiguratorAddr, signer)

  // await aaveFetching()
  // let txHash = await poolConfigurator.setBorrowableInIsolation(evmNetConfig.usdt, false)
  // console.log(`[DAVID] Set isolation mode to false for usdt reservation asset! txHash = ${txHash}`)
  
  // ******* update AToken
  // const txHash = await poolConfigurator.updateAToken(
  //   evmNetConfig.usdt,
  //   '0x918737Bd3fDCDDb2ae30De41e3e89806fC8228bf',
  //   '0x5ef7987a7D0c5131C6DB42E28188BF6a72fb12F9',
  //   'Aqualoan Aq USDT',
  //   'aqUSDT',
  //   '0xB7b4A4814727d16aEe80168ad50aB716eD06Ff40',
  //   []
  // )
  // console.log(`[DAVID] Update AToken! txHash = ${txHash}`)

  // ******* set debt ceiling
  // const txHash = await poolConfigurator.setDebtCeiling(
  //   evmNetConfig.usdt,
  //   0
  // )
  // console.log(`[DAVID] Set debtCeiling for USDT! txHash = ${txHash}`)

  // ******* change pool-configurator address
  // const oldConfigurator = await addrProvider.getAddress('POOL_CONFIGURATOR')
  // console.log(`[DAVID](AAVE) old configurator =`, oldConfigurator)
  // // const newConfigurator = signer.address
  // const newConfigurator = "0x85615611FFD1Ee407A8a28Aab36babf675840cDd"
  // await addrProvider.setAddress('POOL_CONFIGURATOR', newConfigurator)
  // console.log(`[DAVID](AAVE) updated configurator =`, await addrProvider.getAddress('POOL_CONFIGURATOR'))
  
  // ********Change reserved asset configuration
  // let reserveAsset:any = await pool.getConfiguration(evmNetConfig.aaveToken)
  // // console.log(usdcAssetInfo)
  // reserveAsset.borrowingEnabled = true
  // const configuration = encodeReserveConfigurationMap(reserveAsset)
  // // console.log(configuration)
  // const txHash = await pool.setConfiguration(evmNetConfig.aaveToken, configuration)
  // console.log(`[DAVID](AAVE) Set configuration of aave :`, txHash)

  // ******** Oracle set asset sources
  const oracleAddr = await addrProvider.getPriceOracle()
  const aaveOrcle = new AaveOracle(oracleAddr, signer)
  // console.log(await aaveOrcle.getAssetPrice(evmNetConfig.usdc))
  const txHash = await aaveOrcle.setAssetSources([
    "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    "0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA",
    "0x55d398326f99059fF775485246999027B3197955",
    "0xfb6115445Bff7b52FeB98650C87f44907E58f802",
    "0x12f31B73D812C6Bb0d735a218c086d44D5fe5f89",
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409",
  ], [
    '0x132d3C0B1D2cEa0BC552588063bdBb210FDeecfA',
    '0xca236E327F629f9Fc2c30A4E95775EbF0B89fac8',
    '0x132d3C0B1D2cEa0BC552588063bdBb210FDeecfA',
    '0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf',
    '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e',
    '0xB97Ad0E74fa7d920791E90258A6E2085088b4320',
    '0xA8357BF572460fC40f4B0aCacbB2a6A61c89f475',
    '0x0bf79F617988C472DcA68ff41eFe1338955b9A80',
    '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e',
    '0x390180e80058A8499930F0c13963AD3E0d86Bfc9'
  ])
  console.log(`[DAVID](AAVE) Set Oracle sources :`, txHash)

  // ************ Drop Reserve
  // const txHash = await poolConfigurator.dropReserve("0xA40640458FBc27b6EefEdeA1E9C9E17d4ceE7a21")
  // console.log(`[DAVID](AAVE) Drop Reserve :`, txHash)
}