import { signer } from "..";
import { evmNetConfig } from "../../constants";
import { decodeReserveConfigurationMap, encodeReserveConfigurationMap } from '../../sdks/aave/helper';
import { AAVE_Pool } from "../../sdks/aave/pool";
import { AAVE_PoolAddressesProvider } from "../../sdks/aave/poolAddressesProvider";
import { AAVE_PoolConfigurator } from "../../sdks/aave/poolConfigurator";

export async function aaveTest() {
  const addrProvider = new AAVE_PoolAddressesProvider(evmNetConfig.aave.addressesProvider, signer)
  
  // ******* set isolation mode
  const poolConfiguratorAddr = await addrProvider.getPoolConfigurator()
  // console.log(poolConfiguratorAddr)
  const poolConfigurator = new AAVE_PoolConfigurator(poolConfiguratorAddr, signer)
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
  const txHash = await poolConfigurator.setDebtCeiling(
    evmNetConfig.usdt,
    0
  )
  console.log(`[DAVID] Set debtCeilling for USDT! txHash = ${txHash}`)

  // ******* change pool-configurator address
  const poolAddr = await addrProvider.getPool()
  const pool = new AAVE_Pool(poolAddr, signer)
  // const oldConfigurator = await addrProvider.getAddress('POOL_CONFIGURATOR')
  // console.log(`[DAVID](AAVE) old configurator =`, oldConfigurator)
  // const newConfigurator = '0x42f468b48D16d2626aa248797447D0D1FfcaC5f2'
  // await addrProvider.setAddress('POOL_CONFIGURATOR', newConfigurator)
  // console.log(`[DAVID](AAVE) updated configurator =`, await addrProvider.getAddress('POOL_CONFIGURATOR'))
  
  // ********Change configuration
  // let usdcAssetInfo:any = await pool.getConfiguration(evmNetConfig.usdt)
  // usdcAssetInfo.decimals = 18
  // const configuration = encodeReserveConfigurationMap(usdcAssetInfo)
  // const txHash = await pool.setConfiguration(evmNetConfig.usdt, configuration)
  // console.log(`[DAVID](AAVE) Set configuration of USDT :`, txHash)
}