// src/config/networks.config.js
export const networksConfig = {
    arbitrum: {
      CHAIN_ID: 42161,
      NATIVE_SYMBOL: 'ETH',
      ENABLED: true,
      RPC_URL: process.env.ARBITRUM_RPC_URL,
      protocols: {
        aave: {
          ADDRESSES_PROVIDER: process.env.ARBITRUM_AAVE_ADDRESSES_PROVIDER
        }
      }
    },

    ethereum: {
      CHAIN_ID: 1,
      NATIVE_SYMBOL: 'ETH',
      ENABLED: false, // ← просто выключили
      RPC_URL: process.env.ETHEREUM_RPC_URL,
      protocols: {
        aave: {
          ADDRESSES_PROVIDER: process.env.ETHEREUM_AAVE_ADDRESSES_PROVIDER
        }
      }
    }
};
