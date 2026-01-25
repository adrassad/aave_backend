// blockchain/networks/arbitrum/index.js
import { JsonRpcProvider } from "ethers";

export function createEthereumNetwork(config) {
  //console.log('createArbitrumNetwork: config', config);
  return {
    name: "etherium",
    chainId: config.CHAIN_ID,
    provider: new JsonRpcProvider(config.RPC_URL),
    config: {
      protocols: config.protocols,
    },
  };
}
