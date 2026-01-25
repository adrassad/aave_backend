// src/blockchain/networks/arbitrum/config.js
import { networksConfig } from "../../../config/networks.config.js";

export const NETWORK_CONFIG = {
  name: "etherium",
  chainId: 1,
  RPC_URL: networksConfig.etherium.RPC_URL,

  // Aave
  aave: {
    ADDRESSES_PROVIDER:
      networksConfig.ethereum.protocols.aave.ADDRESSES_PROVIDER,
  },
};
