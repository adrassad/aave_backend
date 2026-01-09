// src/services/wallet.service.js
import { ethers } from 'ethers';

import {
  addWallet,
  removeWallet,
  getWalletsByUser,
  countWalletsByUser,
  walletExists
} from '../db/repositories/wallet.repo.js';

import { isPro } from './user.service.js';

const FREE_WALLETS_LIMIT = 1;
const PRO_WALLETS_LIMIT = 10;

function normalizeAddress(address) {
  return address.trim().toLowerCase();
}

export async function addUserWallet(userId, address, label = null) {
  if (!ethers.isAddress(address)) {
    throw new Error('INVALID_ADDRESS');
  }

  const normalizedAddress = normalizeAddress(address);

  const exists = await walletExists(userId, normalizedAddress);
  if (exists) {
    throw new Error('WALLET_ALREADY_EXISTS');
  }

  const pro = await isPro(userId);
  const count = await countWalletsByUser(userId);

  if (!pro && count >= FREE_WALLETS_LIMIT) {
    throw new Error('FREE_LIMIT_REACHED');
  }

  if (pro && count >= PRO_WALLETS_LIMIT) {
    throw new Error('PRO_LIMIT_REACHED');
  }

  return addWallet(userId, normalizedAddress, 'arbitrum', label);
}

export async function removeUserWallet(userId, walletId) {
  const removed = await removeWallet(userId, walletId);

  if (!removed) {
    throw new Error('WALLET_NOT_FOUND');
  }

  return removed;
}

export async function getUserWallets(userId) {
  return getWalletsByUser(userId);
}
