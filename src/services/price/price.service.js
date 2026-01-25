//src/services/price.service.js
import { getPriceCache, setPriceToCash } from "../../cache/price.cache.js";
import { db } from "../../db/index.js";
import { getAssetsByNetwork } from "../asset/asset.service.js";
import { getEnabledNetworks } from "../network/network.service.js";
import { getPrices } from "../../blockchain/index.js";

export async function syncPrices() {
  const networks = await getEnabledNetworks();
  for (const network of Object.values(networks)) {
    console.log(`🔗 Network: ${network.id}`);
    const assets = await getAssetsByNetwork(network.id);
    //console.log("syncPrices assets", assets);
    const prices = await getPrices(network.name, "aave", assets);
    //console.log("syncPrices prices: ", prices);
    for (const price of Object.values(prices)) {
      //console.log("syncPrices price", price);
      const asset = assets[price.address];
      //console.log("syncPrices asset", asset);
      savePriceIfChanged(network, asset, price.price);
    }
  }
}

/**
 * Цена 1 токена в USD по адресу
 */
export async function getAssetPriceUSD(network_id, assetAddress) {
  const address = assetAddress.toLowerCase();
  // cache (address → price)
  const dataPrice = getPriceCache(network_id, address);
  if (!dataPrice && dataPrice.priceUSD != 0) {
    return dataPrice.priceUSD;
  }

  const asset = await assetRepo.findByAddress(address);
  if (!asset) return 0;

  const price = (await priceRepo.getLastPriceByAssetAddress(address)) ?? 0;

  setPriceToCash(network_id, address, price);

  return price;
}

/*
 * Сохраняем цену токена по адресу (если изменилась)
 */
export async function savePriceIfChanged(network, asset, priceUsd) {
  if (!asset?.address) {
    console.warn("⚠️ asset.address is missing", asset);
    return;
  }
  //console.log("savePriceIfChanged asset", asset);
  const address = asset.address.toLowerCase();
  const lastPrice = 0;
  const dataPrice = getPriceCache(network.id, address);
  if (dataPrice && dataPrice.priceUSD) {
    lastPrice = dataPrice.priceUSD;
  }

  // если цена не изменилась — ничего не делаем
  if (lastPrice !== undefined && Math.abs(lastPrice - priceUsd) < 1e-8) {
    return;
  }

  try {
    await db.prices.savePrice(network.id, asset.id, priceUsd);
    setPriceToCash(network.id, address, {
      priceUsd: priceUsd,
      symbol: asset.symbol,
      chain_id: network.chain_id,
      native_symbol: network.native_symbol,
      chain_name: network.name,
    });
  } catch (e) {
    console.error(`❌ Failed to save price for ${asset.id}:`, e);
  }
}
