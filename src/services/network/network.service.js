import { db } from "../../db/index.js";
import { NETWORK_CHACHE } from "../../cache/memory.cache.js";

export async function getEnabledNetworks() {
    if (NETWORK_CHACHE=={}) {
        console.log('downloading from DB');
        return db.networks.getEnabled();    
    }
    return NETWORK_CHACHE;
}

export async function loadNetworksToCache() {
  const networks = await db.networks.getEnabled();
  //console.log('loadNetworksToCache networks:', networks);
  for (const network of networks) {
    NETWORK_CHACHE[network.chain_id] = {
      id: network.id,
      chain_id: network.chain_id,
      name: network.name.toLowerCase(),
      native_symbol: network.native_symbol,
      enabled: network.enabled
    };
  }
  //console.log('loadNetworksToCache NETWORK_CHACHE: ', NETWORK_CHACHE);
}