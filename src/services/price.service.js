import { query } from '../db/index.js';
import { PRICE_CACHE } from '../cache/memory.cache.js';

export async function savePrice(symbol, priceUsd) {
  PRICE_CACHE[symbol] = priceUsd;

  // insert into DB only if changed
  const lastPriceRes = await query(
    'SELECT price_usd FROM prices p JOIN assets a ON p.asset_id = a.id WHERE a.symbol = $1 ORDER BY timestamp DESC LIMIT 1',
    [symbol]
  );

  const lastPrice = lastPriceRes.rows[0]?.price_usd;

  if (lastPrice !== Number(priceUsd)) {
    await query(
      `INSERT INTO prices (asset_id, price_usd, timestamp)
       SELECT id, $1, NOW() FROM assets WHERE symbol = $2`,
      [priceUsd, symbol]
    );
  }
}
