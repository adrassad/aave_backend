// src/db/repositories/price.repo.js
import { PRICE_CACHE } from '../../cache/memory.cache.js';

export function createPriceRepository(db) {
  return {
    async getLastPriceByAssetAddress(address) {
      const res = await db.query(
        `
        SELECT p.price_usd
        FROM prices p
        JOIN assets a ON p.asset_id = a.id
        WHERE a.address = $1
        ORDER BY p.timestamp DESC
        LIMIT 1
        `,
        [address.toLowerCase()]
      );

      return res.rows[0]?.price_usd ?? null;
    },

    async insertPriceIfChanged(asset, priceUsd) {
      const cacheKey = `asset_${asset.id}`;
      const cachedPrice = PRICE_CACHE[cacheKey];

      if (cachedPrice !== undefined && Math.abs(cachedPrice - priceUsd) < 1e-8) {
        return; // почти одинаково
      }

      const last = await db.query(
        `
        SELECT price_usd
        FROM prices
        WHERE asset_id = $1
        ORDER BY timestamp DESC
        LIMIT 1
        `,
        [asset.id]
      );

      const lastPrice = last.rows[0]?.price_usd ?? 0;

      if (Math.abs(lastPrice - priceUsd) < 1e-8) {
        PRICE_CACHE[cacheKey] = lastPrice;
        return;
      }

      await db.query(
        `
        INSERT INTO prices (network_id, asset_id, price_usd, timestamp)
        VALUES ($1, $2, $3, NOW())
        `,
        [asset.network_id, asset.id, priceUsd]
      );

      PRICE_CACHE[cacheKey] = priceUsd;
    }
  };
}
