import { ethers } from 'ethers';
import { provider } from '../provider.js';

const ADDRESSES_PROVIDER = '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb';
const PROVIDER_ABI = [
  'function getPool() view returns (address)',
  'function getPriceOracle() view returns (address)'
];
const POOL_ABI = [
  'function getReservesList() view returns (address[])'
];

export async function initAave() {
  const providerContract = new ethers.Contract(ADDRESSES_PROVIDER, PROVIDER_ABI, provider);
  const poolAddress = await providerContract.getPool();
  const oracleAddress = await providerContract.getPriceOracle();
  const pool = new ethers.Contract(poolAddress, POOL_ABI, provider);
  return { pool, oracleAddress };
}
