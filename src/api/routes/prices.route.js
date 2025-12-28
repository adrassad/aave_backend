import express from 'express';
import { getAssetBySymbol } from '../../services/asset.service.js';
import { PRICE_CACHE } from '../../cache/memory.cache.js';

const router = express.Router();

router.get('/:ticker', (req, res) => {
  const symbol = req.params.ticker.toUpperCase();
  const asset = getAssetBySymbol(symbol);

  if (!asset) return res.status(404).json({ error: 'Token not supported' });

  const priceUsd = PRICE_CACHE[symbol] || null;
  res.json({ symbol, address: asset.address, priceUsd });
});

export default router;
