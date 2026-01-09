// src/db/repositories/wallet.repo.js
import { query } from '../index.js';

/**
 * Добавить кошелёк пользователю
 */
export async function addWallet(
  userId,
  address,
  chain = 'arbitrum',
  label = null
) {
  const res = await query(
    `
    INSERT INTO wallets (user_id, address, chain, label)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, address) DO NOTHING
    RETURNING *
    `,
    [userId, address.toLowerCase(), chain, label]
  );

  return res.rows[0] || null;
}

/**
 * Удалить кошелёк пользователя
 */
export async function removeWallet(userId, walletId) {
  const res = await query(
    `
    DELETE FROM wallets
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `,
    [walletId, userId]
  );

  return res.rows[0] || null;
}

/**
 * Получить все кошельки пользователя
 */
export async function getWalletsByUser(userId) {
  const res = await query(
    `
    SELECT id, address, chain, label, created_at
    FROM wallets
    WHERE user_id = $1
    ORDER BY created_at ASC
    `,
    [userId]
  );

  return res.rows;
}

/**
 * Посчитать количество кошельков пользователя
 */
export async function countWalletsByUser(userId) {
  const res = await query(
    `
    SELECT COUNT(*)::int AS count
    FROM wallets
    WHERE user_id = $1
    `,
    [userId]
  );

  return res.rows[0].count;
}

/**
 * Проверить, существует ли кошелёк у пользователя
 */
export async function walletExists(userId, address) {
  const res = await query(
    `
    SELECT 1
    FROM wallets
    WHERE user_id = $1 AND address = $2
    LIMIT 1
    `,
    [userId, address.toLowerCase()]
  );

  return res.rowCount > 0;
}
