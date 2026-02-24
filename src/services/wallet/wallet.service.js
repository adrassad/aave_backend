// src/services/wallet.service.js
import { ethers } from "ethers";
import { assertCanAddWallet } from "../subscription/subscription.service.js";
import { db } from "../../db/index.js";
import {
  setAllWalletsToCache,
  getWalletsByUser,
  setWalletsToCache,
  delWalletFromCache,
} from "../../cache/wallet.cache.js";

function normalizeAddress(address) {
  return address.trim().toLowerCase();
}

export async function addUserWallet(telegramId, address, label = null) {
  //🔐 ПРОВЕРКА ПОДПИСКИ
  const count = await db.wallets.exists(telegramId);
  await assertCanAddWallet(telegramId, count);

  // 🔐 Проверка адреса
  if (!ethers.isAddress(address)) {
    throw new Error("INVALID_ADDRESS");
  }

  const normalizedAddress = normalizeAddress(address);

  // 🔁 Проверка на существование
  const exists = await db.wallets.walletExists(telegramId, normalizedAddress);
  if (exists) {
    throw new Error("WALLET_ALREADY_EXISTS");
  }

  const wallet = await db.wallets.create({
    telegramId,
    normalizedAddress,
    label,
  });
  let mapWallet = await getWalletsByUser(telegramId);
  mapWallet.set(normalizedAddress, wallet);

  setWalletsToCache(telegramId, mapWallet);

  return wallet;
}

export async function removeUserWallet(telegramId, walletId) {
  const removed = await db.wallets.deleteUserWallet(telegramId, walletId);

  if (!removed) {
    throw new Error("WALLET_NOT_FOUND");
  }
  delWalletFromCache(telegramId, walletId);
  return removed;
}

export async function getUserWallets(telegramId) {
  //id, address, label, created_at
  return await getWalletsByUser(telegramId);
}

export async function getUserWallet(telegramId, address) {
  //id, address, label, created_at
  return await (await getWalletsByUser(telegramId)).get(address);
}

export async function getAllWallets() {
  const result = await db.wallets.findAll();
  const wallets = new Map();

  for (const record of result) {
    const { address, ...rest } = record;

    if (!wallets.has(address)) {
      wallets.set(address, []);
    }

    wallets.get(address).push(rest);
  }
  return wallets;
}

export async function loadWalletsToCache() {
  const walletsArray = Object.values(await db.wallets.findAll());
  const result = new Map();

  if (!Array.isArray(walletsArray) || walletsArray.length === 0) {
    return result;
  }

  for (const wallet of walletsArray) {
    const { id, user_id, address, label, created_at } = wallet;

    if (!user_id || !address) continue;

    // если у пользователя ещё нет Map — создаём
    if (!result.has(user_id)) {
      result.set(user_id, new Map());
    }

    const userWallets = result.get(user_id);

    userWallets.set(address, {
      id,
      user_id,
      address,
      label,
      created_at,
    });
  }
  await setAllWalletsToCache(result);
  console.log("✅ Cached wallets:", walletsArray.length);
}
