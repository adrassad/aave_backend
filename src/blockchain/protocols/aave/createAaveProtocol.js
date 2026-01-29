import { AaveEthereumAdapter } from "../../adapters/protocols/aave/ethereum.adapter.js";
import { AaveArbitrumAdapter } from "../../adapters/protocols/aave/arbitrum.adapter.js";
import { AaveAvalancheAdapter } from "../../adapters/protocols/aave/avalanche.adapter.js";

const aaveAdaptersByNetwork = {
  ethereum: AaveEthereumAdapter,
  arbitrum: AaveArbitrumAdapter,
  avalanche: AaveAvalancheAdapter,
};

export function createAaveProtocol({ networkName, provider, config }) {
  const Adapter = aaveAdaptersByNetwork[networkName];

  if (!Adapter) {
    throw new Error(`Aave is not supported on network ${networkName}`);
  }

  return new Adapter({ provider, config });
}
