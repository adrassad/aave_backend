// asset.cache.js
// address -> { address, symbol, decimals }
const ASSETS_CACHE = {};

export function getAssetCache(network_id, address) {
  if (!ASSETS_CACHE[network_id]) {
    ASSETS_CACHE[network_id] = {};
  }
  return ASSETS_CACHE[network_id]?.[address.toLowerCase()] ?? null;
}

export function setAssetsToCash(network_id, assets) {
  if (!ASSETS_CACHE[network_id]) {
    ASSETS_CACHE[network_id] = {};
  }
  for (const asset of assets) {
    ASSETS_CACHE[network_id][asset.address.toLowerCase()] = asset;
  }
  console.log(`✅ Loaded ${assets.length} assets into cache`);
}

export function getAssetsByNetworkCash(network_id) {
  console.warn("getAssetsByNetworkCash network_id: ", network_id);
  if (!ASSETS_CACHE[network_id]) {
    console.warn(
      "getAssetsByNetworkCash is empty cache by id_network: ",
      network_id,
    );
    ASSETS_CACHE[network_id] = {};
  }
  console.warn("getAssetsByNetworkCash ASSETS_CACHE: ", ASSETS_CACHE);
  return ASSETS_CACHE[network_id];
}
