//src/cache/price.cache.js
// network_id -> address -> dataPrice
const PRICE_CACHE = {};

export function getPriceCache(network_id, address) {
  if (!PRICE_CACHE[network_id]) {
    PRICE_CACHE[network_id] = {};
  }
  return PRICE_CACHE[network_id]?.[address.toLowerCase()] ?? 0;
}

export function setPriceToCash(network_id, address, dataPrice) {
  if (!PRICE_CACHE[network_id]) {
    PRICE_CACHE[network_id] = {};
  }
  PRICE_CACHE[network_id][address.toLowerCase()] = dataPrice;
  //console.log(`✅ Loaded price into cache`);
}

export function getPricesByNetworkCash(network_id) {
  if (!PRICE_CACHE[network_id]) {
    PRICE_CACHE[network_id] = {};
  }
  return PRICE_CACHE[network_id];
}

export function getPricesByAddress(address) {
  const result = [];
  const normalizedAddress = address.toLowerCase();

  for (const [networkId, prices] of Object.entries(PRICE_CACHE)) {
    if (prices[normalizedAddress] !== undefined) {
      result.push({
        networkId,
        address: normalizedAddress,
        dataPrice: prices[normalizedAddress],
      });
    }
  }

  return result;
}
export function getPricesBySymbol(symbol) {
  const result = [];
  const normalizedSymbol = symbol.toUpperCase();

  for (const [networkId, prices] of Object.entries(PRICE_CACHE)) {
    for (const [address, dataPrice] of Object.entries(prices)) {
      if (
        dataPrice?.symbol &&
        dataPrice.symbol.toUpperCase() === normalizedSymbol
      ) {
        result.push({
          networkId,
          chain_id: dataPrice.chain_id,
          chain_name: dataPrice.chain_name,
          address,
          dataPrice,
        });
      }
    }
  }

  return result;
}
