import { query } from '../db/index.js';
import { ASSETS_CACHE } from '../cache/memory.cache.js';

export async function loadAssets(assets) {
  for (const asset of assets) {
    ASSETS_CACHE[asset.symbol.toUpperCase()] = asset;
    // insert or ignore into DB
    await query(
      'INSERT INTO assets (symbol, address, decimals) VALUES ($1, $2, $3) ON CONFLICT (symbol) DO NOTHING',
      [asset.symbol, asset.address, asset.decimals]
    );
  }
}

export function getAssetBySymbol(symbol) {
  return ASSETS_CACHE[symbol.toUpperCase()];
}

export function getAllAssets() {
  return Object.values(ASSETS_CACHE);
}
