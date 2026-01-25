import { db } from "../../db/index.js";
import {
  setNetworkToCashe,
  getEnabledNetworksCashe,
} from "../../cache/network.cashe.js";

export async function getEnabledNetworks() {
  return getEnabledNetworksCashe();
}

export async function loadNetworksToCache() {
  const networks = await db.networks.getEnabled();
  for (const network of networks) {
    setNetworkToCashe(network);
  }
}
