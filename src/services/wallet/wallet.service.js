// src/services/wallet.service.js
import { ethers } from "ethers";
import { assertCanAddWallet } from "../subscription/subscription.service.js";
import { db } from "../../db/index.js";

function normalizeAddress(address) {
  return address.trim().toLowerCase();
}

export async function addUserWallet(userId, address, label = null) {
  //🔐 ПРОВЕРКА ПОДПИСКИ
  const count = await db.wallets.countWalletsByUser(userId);
  await assertCanAddWallet(userId, count);

  // 🔐 Проверка адреса
  if (!ethers.isAddress(address)) {
    throw new Error("INVALID_ADDRESS");
  }

  const normalizedAddress = normalizeAddress(address);

  // 🔁 Проверка на существование
  const exists = await db.wallets.walletExists(userId, normalizedAddress);
  if (exists) {
    throw new Error("WALLET_ALREADY_EXISTS");
  }

  return db.wallets.addWallet(userId, normalizedAddress, label);
}

export async function removeUserWallet(userId, walletId) {
  const removed = await db.wallets.removeWallet(userId, walletId);

  if (!removed) {
    throw new Error("WALLET_NOT_FOUND");
  }

  return removed;
}

export async function getUserWallets(userId) {
  return db.wallets.getWalletsByUser(userId);
}

export async function getAllWallets() {
  const result = await db.wallets.getAllWallets();
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
