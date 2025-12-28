import { ethers } from 'ethers';
import { provider } from '../provider.js';

export const ORACLE_ABI = [
  'function getAssetPrice(address asset) view returns (uint256)'
];

export function createOracle(oracleAddress) {
  return new ethers.Contract(oracleAddress, ORACLE_ABI, provider);
}
