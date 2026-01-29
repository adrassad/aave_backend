import { db } from "../../db/index.js";
import {
  setNetworkToCashe,
  getEnabledNetworksCache,
} from "../../cache/network.cashe.js";

export async function getEnabledNetworks() {
  return await getEnabledNetworksCache();
}

export async function loadNetworksToCache() {
  const networks = await db.networks.getNetworks();
  //console.log("loadNetworksToCache networks: ", networks);
  for (const network of networks) {
    await setNetworkToCashe(network);
  }
}
