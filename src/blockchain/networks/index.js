// blockchain/networks/index.js
import { networksConfig } from "../../config/networks.config.js";
import { createArbitrumNetwork } from "./arbitrum/index.js";
import { createEthereumNetwork } from "./ethereum/index.js";

export const networksRegistry = {
  arbitrum: createArbitrumNetwork(networksConfig.arbitrum),
  ethereum: createEthereumNetwork(networksConfig.ethereum),
};
