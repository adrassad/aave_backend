import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';

const app = express();
app.use(cors());

/* ================= RPC ================= */

const provider = new ethers.JsonRpcProvider(
  'https://arb1.arbitrum.io/rpc'
);

/* ================= AAVE ================= */

const ADDRESSES_PROVIDER =
  '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb';

const PROVIDER_ABI = [
  'function getPool() view returns (address)',
  'function getPriceOracle() view returns (address)'
];

const POOL_ABI = [
  'function getReservesList() view returns (address[])'
];

const ERC20_ABI = [
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
];

const ORACLE_ABI = [
  'function getAssetPrice(address asset) view returns (uint256)'
];

/* ================= CACHE ================= */

let pool;
let oracle;

const ASSETS_BY_SYMBOL = {}; // SYMBOL -> asset
let ASSETS_LIST = [];        // /assets

const PRICE_CACHE = {};      // SYMBOL -> { price, updatedAt }

/* ================= INIT ================= */

async function init() {
  console.log('⏳ Initializing Aave...');

  const providerContract = new ethers.Contract(
    ADDRESSES_PROVIDER,
    PROVIDER_ABI,
    provider
  );

  const poolAddress = await providerContract.getPool();
  const oracleAddress = await providerContract.getPriceOracle();

  pool = new ethers.Contract(poolAddress, POOL_ABI, provider);
  oracle = new ethers.Contract(oracleAddress, ORACLE_ABI, provider);

  const reserves = await pool.getReservesList();
  const assets = [];

  for (const address of reserves) {
    try {
      const token = new ethers.Contract(address, ERC20_ABI, provider);

      const [symbol, decimals] = await Promise.all([
        token.symbol(),
        token.decimals()
      ]);

      const asset = {
        symbol,
        address,
        decimals: Number(decimals)
      };

      ASSETS_BY_SYMBOL[symbol.toUpperCase()] = asset;
      assets.push(asset);

    } catch {
      // ignore broken tokens
    }
  }

  ASSETS_LIST = assets;

  console.log(`✅ Loaded ${assets.length} assets`);
}

/* ================= PRICE UPDATER ================= */

async function updatePrices() {
  console.log('⏳ Updating prices...');

  for (const asset of ASSETS_LIST) {
    try {
      const price = await oracle.getAssetPrice(asset.address);

      PRICE_CACHE[asset.symbol.toUpperCase()] = {
        priceUsd: Number(price) / 1e8,
        updatedAt: Date.now()
      };
    } catch {
      // skip failed price
    }
  }

  console.log('✅ Prices updated');
}

/* ================= ROUTES ================= */

app.get('/assets', (req, res) => {
  res.json(ASSETS_LIST);
});

app.get('/prices', (req, res) => {
  res.json(PRICE_CACHE);
});

app.get('/price/:ticker', (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const data = PRICE_CACHE[ticker];

  if (!data) {
    return res.status(404).json({ error: 'Price not available' });
  }

  res.json({
    ticker,
    ...data
  });
});

/* ================= START ================= */

(async () => {
  try {
    await init();
    await updatePrices();

    // обновление раз в минуту
    setInterval(updatePrices, 60_000);

    app.listen(3000, () => {
      console.log('🚀 Backend running on http://localhost:3000');
    });
  } catch (e) {
    console.error('❌ Failed to start:', e);
    process.exit(1);
  }
})();
