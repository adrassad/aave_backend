import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';

const app = express();
app.use(cors());

const provider = new ethers.JsonRpcProvider(
  'https://arb1.arbitrum.io/rpc',
  undefined,
  {
    fetchOptions: {
      timeout: 10000
    }
  }
);

// Aave v3 Arbitrum
const ADDRESSES_PROVIDER =
  '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb';

const PROVIDER_ABI = [
  'function getPriceOracle() view returns (address)'
];

const ORACLE_ABI = [
  'function getAssetPrice(address asset) view returns (uint256)'
];

// WETH Arbitrum
const WETH = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';

app.get('/price/eth', async (_, res) => {
  try {
    const providerContract = new ethers.Contract(
      ADDRESSES_PROVIDER,
      PROVIDER_ABI,
      provider
    );

    const oracleAddress = await providerContract.getPriceOracle();

    const oracle = new ethers.Contract(
      oracleAddress,
      ORACLE_ABI,
      provider
    );

    const price = await oracle.getAssetPrice(WETH);

    res.json({
      asset: 'ETH',
      priceUsd: Number(price) / 1e8,
      oracle: oracleAddress
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
