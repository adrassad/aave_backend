// blockchain/networks/index.js
import { networksConfig } from '../../config/networks.config.js';
import { createArbitrumNetwork } from './arbitrum/index.js';

export const networksRegistry = {
  arbitrum: createArbitrumNetwork(networksConfig.arbitrum),
  // ethereum
};
