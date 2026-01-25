import express from "express";
import { getAssetBySymbol } from "../../services/asset/asset.service.js";
import { getPricesBySymbol } from "../../cache/price.cache.js";

const router = express.Router();

router.get("/:ticker", (req, res) => {
  const symbol = req.params.ticker.toUpperCase();
  const asset = getAssetBySymbol(symbol);

  if (!asset) return res.status(404).json({ error: "Token not supported" });

  priceUsd = 0;
  const dataPrice = getPricesBySymbol(symbol);
  console.log("dataPrice: ", dataPrice);
  if (dataPrice) {
    priceUsd = dataPrice.priceUsd;
  }

  res.json({
    chain_name: dataPrice.chain_name,
    symbol,
    address: asset.address,
    priceUsd,
  });
});

export default router;
