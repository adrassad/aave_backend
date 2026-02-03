import express from "express";
import { getAssetBySymbol } from "../../services/asset/asset.service.js";
import { getPricesBySymbol } from "../../cache/price.cache.js";
import { getEnabledNetworksCache } from "../../cache/network.cashe.js";

const router = express.Router();

router.get("/:ticker", async (req, res) => {
  try {
    const symbol = req.params.ticker.toUpperCase();

    const asset = await getAssetBySymbol(symbol);
    if (!asset?.length) {
      return res.status(404).json({ error: "Token not supported" });
    }

    const networks = await getEnabledNetworksCache();

    const prices = await getPricesBySymbol(networks, symbol);
    if (!prices.length) {
      return res.status(404).json({ error: "Price not found" });
    }
    //console.log("API prices: ", prices);
    res.json(
      prices.map((p) => ({
        chain_name: p.chain_name,
        symbol,
        address: p.address,
        priceUsd: p.price_usd,
        timestamp: p.timestamp,
      })),
    );
  } catch (e) {
    console.error("❌ prices API failed:", e);
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
