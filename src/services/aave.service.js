// src/services/aave.service.js
import {
  initAave,
  createAaveOracle,
  getAaveUserPositions,
} from '../blockchain/index.js';
import { getAssetPriceUSD } from './price/price.service.js';
import { getAssetByAddress } from './asset/asset.service.js';
import { assertCanViewPositions } from './subscription/subscription.service.js';

/*
 * Получение позиций пользователя в Aave
 * @param {number} userId - ID пользователя
 * @param {string} walletAddress - адрес кошелька
 * @param {string} networkName - имя сети ('arbitrum', 'ethereum' и т.д.)
 */
export async function getWalletPositions(userId, walletAddress, networkName = 'arbitrum') {
  // 🔐 Проверка подписки
  await assertCanViewPositions(userId);

  // Получаем данные Aave через фасад
  const { positions, healthFactor } = await getAaveUserPositions(networkName, walletAddress);

  const supplies = [];
  const borrows = [];
  let totalSuppliedUsd = 0;
  let totalBorrowedUsd = 0;

  for (const r of positions) {
    const asset = await getAssetByAddress(r.asset);
    if (!asset) continue;

    const decimals = asset.decimals;
    const priceUSD = await getAssetPriceUSD(r.asset);

    if (r.aTokenBalance > 0n) {
      const amount = Number(r.aTokenBalance) / 10 ** decimals;
      const usd = amount * priceUSD;
      supplies.push({
        symbol: asset.symbol,
        amount,
        usd,
        collateral: r.collateral,
      });
      totalSuppliedUsd += usd;
    }

    if (r.variableDebt > 0n || r.stableDebt > 0n) {
      const debt = Number(r.variableDebt + r.stableDebt) / 10 ** decimals;
      const usd = debt * priceUSD;
      borrows.push({
        symbol: asset.symbol,
        amount: debt,
        usd,
      });
      totalBorrowedUsd += usd;
    }
  }

  return {
    supplies,
    borrows,
    totals: {
      suppliedUsd: totalSuppliedUsd,
      borrowedUsd: totalBorrowedUsd,
      netUsd: totalSuppliedUsd - totalBorrowedUsd,
    },
    healthFactor,
  };
}
