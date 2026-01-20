//src/blockchain/protocols/aave/aave.provider.js
import { ethers } from 'ethers';
import { AAVE_POOL_ABI, AAVE_DATA_PROVIDER_ABI } from './abi/aave.abis.js'


export async function getUserAavePositions({provider, config}) {
  const poolAddress = config.aave?.POOL;
  const dataProvider = new ethers.Contract(poolAddress, AAVE_DATA_PROVIDER_ABI, provider);
  return dataProvider; // Логика вызова getUserReserveData в сервисе
}

export async function getAssets({ provider, config }) {
  const poolAddress = config.aave?.POOL;

  if (!poolAddress) {
    throw new Error('Aave POOL address not configured');
  }

  const pool = new ethers.Contract(
    poolAddress,
    AAVE_POOL_ABI,
    provider
  );

  return pool.getReservesList();
}