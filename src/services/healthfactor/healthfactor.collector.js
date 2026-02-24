// src/services/healthfactor/healthfactor.collector.js

import pLimit from "p-limit";
import { getEnabledNetworks } from "../network/network.service.js";
import {
  getAllWallets,
  getUserWallets,
  getUserWallet,
} from "../wallet/wallet.service.js";
import { calculateAndStoreHF } from "./healthfactor.core.js";

const CONCURRENCY = 5;

/*
 * Универсальный сборщик HealthFactor
 * @param {Object} params
 * @param {number|null} params.userId - конкретный пользователь
 * @param {number|null} params.walletId - конкретный кошелек
 * @param {boolean} params.checkChange - true для cron, false для бота
 * @returns Map<userId, Map<walletAddress, Map<networkName, healthfactor>>>
 */
export async function collectHealthFactors({
  userId = null,
  address = null,
  checkChange = false,
}) {
  const networks = await getEnabledNetworks();
  const limit = pLimit(CONCURRENCY);

  const resultMap = new Map();
  const tasks = [];

  // 🟢 1. Определяем набор кошельков
  let wallets;
  if (userId && address) {
    const wallet = await getUserWallet(userId, address);

    if (!wallet) return new Map();

    wallets = new Map();
    wallets.set(wallet.address, [wallet]);

    // заранее создаем entry под userId
    resultMap.set(userId, new Map());
  } else if (userId) {
    const userWallets = await getUserWallets(userId);

    wallets = new Map();
    for (const wallet of userWallets) {
      if (!wallets.has(wallet.address)) {
        wallets.set(wallet.address, []);
      }
      wallets.get(wallet.address).push(wallet);
    }
  } else {
    wallets = await getAllWallets();
  }

  // 🟢 2. Сбор HF
  for (const [address, records] of wallets.entries()) {
    for (const record of records) {
      for (const network of Object.values(networks)) {
        tasks.push(
          limit(async () => {
            try {
              const hfResult = await calculateAndStoreHF({
                address,
                walletId: record.id,
                userId: record.user_id ?? userId,
                network,
                checkChange,
              });

              // Если checkChange=true и HF не изменился, пропускаем
              if (checkChange && !hfResult.isChanged) return;

              const targetUserId = userId ?? record.user_id;
              if (!resultMap.has(targetUserId)) {
                resultMap.set(targetUserId, new Map());
              }

              const walletMap = resultMap.get(targetUserId);
              if (!walletMap.has(address)) {
                walletMap.set(address, new Map());
              }

              walletMap.get(address).set(network.name, hfResult.healthfactor);
            } catch (err) {
              console.error(
                `HF error: wallet=${address} network=${network.name}`,
                err.message,
              );
            }
          }),
        );
      }
    }
  }

  await Promise.allSettled(tasks);

  return resultMap;
}
