export const AAVE_DATA_PROVIDER_ABI = [
  "function getUserReserveData(address asset, address user) view returns (" +
    "uint256 currentATokenBalance," +
    "uint256 currentStableDebt," +
    "uint256 currentVariableDebt," +
    "uint256 principalStableDebt," +
    "uint256 scaledVariableDebt," +
    "uint256 stableBorrowRate," +
    "uint256 liquidityRate," +
    "uint40 stableRateLastUpdated," +
    "bool usageAsCollateralEnabled" +
    ")",
];
