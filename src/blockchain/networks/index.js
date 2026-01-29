// blockchain/networks/index.js
import { networksConfig } from "../../config/networks.config.js";
import { createArbitrumNetwork } from "./arbitrum/index.js";
import { createEthereumNetwork } from "./ethereum/index.js";
import { createAvalancheNetwork } from "./avalanche/index.js";

export const networksRegistry = {
  ethereum: createEthereumNetwork(networksConfig.ethereum),
  arbitrum: createArbitrumNetwork(networksConfig.arbitrum),
  avalanche: createAvalancheNetwork(networksConfig.avalanche),
};
