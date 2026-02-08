// src/cache/price.cache.js
import { redis } from "../redis/redis.client.js";

const PRICE_TTL = 60 * 60; // 1 час

function priceKey(networkId, address) {
  return `price:${networkId}:${address.toLowerCase()}`;
}

/**
 * Получить цену по сети и адресу
 */
export async function getPriceCache(networkId, address) {
  if (redis.status !== "ready") return 0;

  try {
    const data = await redis.get(priceKey(networkId, address));
    if (!data) return 0;
    return JSON.parse(data);
  } catch (err) {
    console.warn("⚠️ Redis getPriceCache failed:", err.message);
    return 0;
  }
}

/**
 * Сохранить цены (address -> dataPrice)
 */
export async function setPriceToCache(networkId, prices) {
  if (redis.status !== "ready") return;

  try {
    const pipeline = redis.pipeline();

    for (const [address, price] of Object.entries(prices)) {
      pipeline.set(
        priceKey(networkId, address),
        JSON.stringify(price),
        "EX",
        PRICE_TTL,
      );
    }

    await pipeline.exec();

    console.log(
      `✅ Cached ${Object.keys(prices).length} prices for ${networkId}`,
    );
  } catch (err) {
    console.warn("⚠️ Redis setPriceToCache failed:", err.message);
  }
}

/**
 * Получить все цены по сети
 * ⚠️ Тяжёлая операция — использовать редко (admin / cron)
 */
export async function getPricesByNetworkCache(networkId) {
  if (redis.status !== "ready") return {};

  try {
    const keys = await redis.keys(`price:${networkId}:*`);
    if (!keys.length) return {};

    const values = await redis.mget(keys);

    const result = {};
    keys.forEach((key, i) => {
      const address = key.split(":")[2];
      if (values[i]) {
        result[address] = JSON.parse(values[i]);
      }
    });

    return result;
  } catch (err) {
    console.warn("⚠️ Redis getPricesByNetworkCache failed:", err.message);
    return {};
  }
}

/**
 * Найти цены по символу (через Redis)
 */
export async function getPricesBySymbolCache(networks, symbol) {
  if (redis.status !== "ready") return [];

  const normalizedSymbol = symbol.toUpperCase();
  const results = [];

  for (const networkId of Object.keys(networks)) {
    try {
      const keys = await redis.keys(`price:${networkId}:*`);
      if (!keys.length) continue;

      const values = await redis.mget(keys);

      keys.forEach((key, i) => {
        if (!values[i]) return;

        const price = JSON.parse(values[i]);
        if (price?.symbol && price.symbol.toUpperCase() === normalizedSymbol) {
          results.push({
            networkId,
            address: key.split(":")[2],
            ...price,
          });
        }
      });
    } catch {
      continue;
    }
  }

  return results;
}
