export function decodeReserveConfigurationMap(data: bigint) {
  return {
    // Bits 0-15: LTV
    ltv: Number(BigInt(data) & BigInt(0xFFFF)),

    // Bits 16-31: Liquidation threshold
    liquidationThreshold: Number((data >> BigInt(16)) & BigInt(0xFFFF)),

    // Bits 32-47: Liquidation bonus
    liquidationBonus: Number((data >> BigInt(32)) & BigInt(0xFFFF)),

    // Bits 48-55: Decimals
    decimals: Number((data >> BigInt(48)) & BigInt(0xFF)),

    // Bit 56: Reserve is active
    reserveIsActive: Boolean((data >> BigInt(56)) & BigInt(1)),

    // Bit 57: Reserve is frozen
    reserveIsFrozen: Boolean((data >> BigInt(57)) & BigInt(1)),

    // Bit 58: Borrowing is enabled
    borrowingEnabled: Boolean((data >> BigInt(58)) & BigInt(1)),

    // Bit 59: Stable rate borrowing enabled
    stableRateBorrowingEnabled: Boolean((data >> BigInt(59)) & BigInt(1)),

    // Bit 60: Asset is paused
    assetIsPaused: Boolean((data >> BigInt(60)) & BigInt(1)),

    // Bit 61: Borrowing in isolation mode is enabled
    borrowingInIsolationModeEnabled: Boolean((data >> BigInt(61)) & BigInt(1)),

    // Bit 62: Siloed borrowing enabled
    siloedBorrowingEnabled: Boolean((data >> BigInt(62)) & BigInt(1)),

    // Bit 63: Flashloaning enabled
    flashloaningEnabled: Boolean((data >> BigInt(63)) & BigInt(1)),

    // Bits 64-79: Reserve factor
    reserveFactor: Number((data >> BigInt(64)) & BigInt(0xFFFF)),

    // Bits 80-115: Borrow cap in whole tokens
    borrowCap: Number((data >> BigInt(80)) & BigInt(0xFFFFFFFFF)),

    // Bits 116-151: Supply cap in whole tokens
    supplyCap: Number((data >> BigInt(116)) & BigInt(0xFFFFFFFFF)),

    // Bits 152-167: Liquidation protocol fee
    liquidationProtocolFee: Number((data >> BigInt(152)) & BigInt(0xFFFF)),

    // Bits 168-175: eMode category
    eModeCategory: Number((data >> BigInt(168)) & BigInt(0xFF)),

    // Bits 176-211: Unbacked mint cap in whole tokens
    unbackedMintCap: Number((data >> BigInt(176)) & BigInt(0xFFFFFFFFF)),

    // Bits 212-251: Debt ceiling for isolation mode
    debtCeiling: Number((data >> BigInt(212)) & BigInt(0xFFFFFFFFFF)),

    // Bits 252-255: Unused
    unused: Number((data >> BigInt(252)) & BigInt(0xF)),
  };
}

export function encodeReserveConfigurationMap(config: {
  ltv: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  decimals: number;
  reserveIsActive: boolean;
  reserveIsFrozen: boolean;
  borrowingEnabled: boolean;
  stableRateBorrowingEnabled: boolean;
  assetIsPaused: boolean;
  borrowingInIsolationModeEnabled: boolean;
  siloedBorrowingEnabled: boolean;
  flashloaningEnabled: boolean;
  reserveFactor: number;
  borrowCap: number;
  supplyCap: number;
  liquidationProtocolFee: number;
  eModeCategory: number;
  unbackedMintCap: number;
  debtCeiling: number;
  unused: number;
}): bigint {
  let data = BigInt(0);

  // Bits 0-15: LTV
  data |= BigInt(config.ltv) & BigInt(0xFFFF);

  // Bits 16-31: Liquidation threshold
  data |= (BigInt(config.liquidationThreshold) & BigInt(0xFFFF)) << BigInt(16);

  // Bits 32-47: Liquidation bonus
  data |= (BigInt(config.liquidationBonus) & BigInt(0xFFFF)) << BigInt(32);

  // Bits 48-55: Decimals
  data |= (BigInt(config.decimals) & BigInt(0xFF)) << BigInt(48);

  // Bit 56: Reserve is active
  data |= BigInt(config.reserveIsActive ? 1 : 0) << BigInt(56);

  // Bit 57: Reserve is frozen
  data |= BigInt(config.reserveIsFrozen ? 1 : 0) << BigInt(57);

  // Bit 58: Borrowing is enabled
  data |= BigInt(config.borrowingEnabled ? 1 : 0) << BigInt(58);

  // Bit 59: Stable rate borrowing enabled
  data |= BigInt(config.stableRateBorrowingEnabled ? 1 : 0) << BigInt(59);

  // Bit 60: Asset is paused
  data |= BigInt(config.assetIsPaused ? 1 : 0) << BigInt(60);

  // Bit 61: Borrowing in isolation mode is enabled
  data |= BigInt(config.borrowingInIsolationModeEnabled ? 1 : 0) << BigInt(61);

  // Bit 62: Siloed borrowing enabled
  data |= BigInt(config.siloedBorrowingEnabled ? 1 : 0) << BigInt(62);

  // Bit 63: Flashloaning enabled
  data |= BigInt(config.flashloaningEnabled ? 1 : 0) << BigInt(63);

  // Bits 64-79: Reserve factor
  data |= (BigInt(config.reserveFactor) & BigInt(0xFFFF)) << BigInt(64);

  // Bits 80-115: Borrow cap in whole tokens
  data |= (BigInt(config.borrowCap) & BigInt(0xFFFFFFFFF)) << BigInt(80);

  // Bits 116-151: Supply cap in whole tokens
  data |= (BigInt(config.supplyCap) & BigInt(0xFFFFFFFFF)) << BigInt(116);

  // Bits 152-167: Liquidation protocol fee
  data |= (BigInt(config.liquidationProtocolFee) & BigInt(0xFFFF)) << BigInt(152);

  // Bits 168-175: eMode category
  data |= (BigInt(config.eModeCategory) & BigInt(0xFF)) << BigInt(168);

  // Bits 176-211: Unbacked mint cap in whole tokens
  data |= (BigInt(config.unbackedMintCap) & BigInt(0xFFFFFFFFF)) << BigInt(176);

  // Bits 212-251: Debt ceiling for isolation mode
  data |= (BigInt(config.debtCeiling) & BigInt(0xFFFFFFFFFF)) << BigInt(212);

  // Bits 252-255: Unused
  data |= (BigInt(config.unused) & BigInt(0xF)) << BigInt(252);

  return data;
}

export function toBytes32(str: string): string {
  // Convert string to a hexadecimal representation
  let hex = Buffer.from(str, 'utf8').toString('hex');
  
  // Ensure it's no more than 32 bytes (64 hex characters)
  if (hex.length > 64) {
    throw new Error('String is too long to fit into 32 bytes');
  }
  
  // Pad the hex string with zeros (to the right) to make it 32 bytes long
  while (hex.length < 64) {
    hex += '00';
  }
  
  return '0x' + hex;
}
