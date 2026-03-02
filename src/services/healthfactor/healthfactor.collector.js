// src/services/healthfactor/healthfactor.collector.js

import pLimit from "p-limit";
import { getEnabledNetworks } from "../network/network.service.js";
import {
  getAllWallets,
  getUserWallets,
  getUserWallet,
} from "../wallet/wallet.service.js";
import { calculateAndStoreHF } from "./healthfactor.core.js";
import { extractUniqueAddresses } from "../wallet/wallet.utils.js";

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

  let resultMap = new Map();
  const tasks = [];

  // 🟢 1. Определяем набор кошельков
  let wallets;
  if (userId && address) {
    const wallet = await getUserWallet(userId, address);

    if (!wallet) return new Map();

    wallets = new Map();
    wallets.set(wallet.address, [wallet]);

    // заранее создаем entry под userId
    resultMap.set(userId, wallets);
  } else if (userId) {
    const userWallets = await getUserWallets(userId);

    wallets = new Map();
    for (const wallet of userWallets) {
      if (!wallets.has(wallet.address)) {
        wallets.set(wallet.address, []);
      }
      wallets.get(wallet.address).push(wallet);
    }
    resultMap.set(userId, wallets);
  } else {
    resultMap = await getAllWallets();
  }

  const addresses = extractUniqueAddresses(resultMap);

  const mapHF = new Map();

  for (const address of addresses) {
    const mNet = new Map();
    for (const network of Object.values(networks)) {
      const hfResult = await calculateAndStoreHF({
        address,
        network,
        checkChange,
      });
      mNet.set(network.name, hfResult);
    }
    mapHF.set(address, mNet);
  }

  // 🟢 2. Сбор HF
  //userId -> address -> network -> healthfactor
  // 🟢 2. Сбор HF → Map(userId, Map(address, Map(network, hf)))

  const finalResult = new Map();

  for (const [uId, walletsMap] of resultMap.entries()) {
    const userAddressMap = new Map();
    let hfIsChanged = false;
    for (const address of walletsMap.keys()) {
      const networkMap = new Map();
      for (const network of Object.values(networks)) {
        const resultHF = mapHF.get(address)?.get(network.name);
        if (resultHF && resultHF.isChanged) {
          networkMap.set(network.name, resultHF.healthfactor);
          hfIsChanged = true;
        }
      }
      if (hfIsChanged) {
        userAddressMap.set(address, networkMap);
      }
    }
    if (hfIsChanged) {
      finalResult.set(uId, userAddressMap);
    }
  }

  return finalResult;
}
