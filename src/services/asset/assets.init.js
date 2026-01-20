// src/services/assets.init.js
import { ethers } from 'ethers';
import { ERC20_ABI } from '../../blockchain/abi/erc20.abi.js';
import { initAave, getProvider } from '../../blockchain/index.js';
import { loadAssets, loadAssetsToCache } from './asset.service.js';

const DEFAULT_NETWORK = 'arbitrum';

export async function initAssets() {
  // ⬅️ ВАЖНО: работаем через blockchain facade
  const provider = getProvider(DEFAULT_NETWORK);
  const { pool } = await initAave(DEFAULT_NETWORK);

  const reserves = await pool.getReservesList();
  const assets = [];

  for (const address of reserves) {
    try {
      const token = new ethers.Contract(address, ERC20_ABI, provider);
      const [symbol, decimals] = await Promise.all([
        token.symbol(),
        token.decimals()
      ]);

      assets.push({
        symbol,
        address,
        decimals: Number(decimals),
        network: DEFAULT_NETWORK
      });
    } catch {
      // пропускаем нестандартные токены
    }
  }

  await loadAssets(assets);
  await loadAssetsToCache();

  console.log(`✅ Loaded ${assets.length} assets for ${DEFAULT_NETWORK}`);
}
