import { ethers } from 'ethers';
import { ENV } from '../config/env.js';

export const provider = new ethers.JsonRpcProvider(ENV.RPC_URL);
