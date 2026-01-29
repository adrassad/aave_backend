//src/blockchain/protocols/createProtocolAdapter.js
import { protocolRegistry } from "./index.js";

export function createProtocolAdapter({
  protocolName,
  networkName,
  provider,
  protocolConfig,
}) {
  const factory = protocolRegistry[protocolName];

  if (!factory) {
    throw new Error(`Protocol ${protocolName} not supported`);
  }

  return factory({
    networkName,
    provider,
    config: protocolConfig,
  });
}
