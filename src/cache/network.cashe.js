const NETWORK_CHACHE = {};

export function setNetworkToCashe(dataNetwork) {
  NETWORK_CHACHE[dataNetwork.chain_id] = {
    id: dataNetwork.id,
    chain_id: dataNetwork.chain_id,
    name: dataNetwork.name.toLowerCase(),
    native_symbol: dataNetwork.native_symbol,
    enabled: dataNetwork.enabled,
  };
}

export function getEnabledNetworksCashe() {
  return NETWORK_CHACHE;
}
