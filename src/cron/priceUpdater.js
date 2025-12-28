import cron from 'node-cron';
import { ASSETS_CACHE } from '../cache/memory.cache.js';
import { createOracle } from '../blockchain/aave/aave.oracle.js';
import { savePrice } from '../services/price.service.js';

// receive oracle instance
export function startPriceUpdater(oracle) {
  cron.schedule('* * * * *', async () => {
    console.log('⏱ Updating prices...');
    try {
      for (const symbol in ASSETS_CACHE) {
        const asset = ASSETS_CACHE[symbol];
        const priceBig = await oracle.getAssetPrice(asset.address);
        const priceUsd = Number(priceBig) / 1e8;
        await savePrice(symbol, priceUsd);
      }
    } catch (e) {
      console.error('Price updater error:', e);
    }
  });
}
