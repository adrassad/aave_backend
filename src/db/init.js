// src/db/initDb.js
import { PostgresClient } from './postgres.client.js';

const dbClient = new PostgresClient();

export async function initDb() {
  
  // ---- USERS ----
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS users (
      telegram_id BIGINT PRIMARY KEY,
      subscription_level TEXT NOT NULL DEFAULT 'free',
      subscription_end TIMESTAMP
    )
  `);

  // ---- NETWORKS ----
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS networks (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,       
      chain_id INTEGER NOT NULL UNIQUE,
      native_symbol TEXT NOT NULL,     
      enabled BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // ---- ASSETS ----
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS assets (
      id SERIAL PRIMARY KEY,
      network_id INTEGER NOT NULL
        REFERENCES networks(id)
        ON DELETE CASCADE,
      address TEXT NOT NULL UNIQUE,
      symbol TEXT NOT NULL,
      decimals INTEGER NOT NULL
    )
  `);

  // ---- PRICES ----
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS prices (
      id SERIAL PRIMARY KEY,
      network_id INTEGER NOT NULL
        REFERENCES networks(id)
        ON DELETE CASCADE,
      asset_id INTEGER REFERENCES assets(id),
      price_usd NUMERIC NOT NULL,
      timestamp TIMESTAMP NOT NULL
    )
  `);

  // ---- MONITORS ----
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS monitors (
      id SERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(telegram_id),
      wallet_address TEXT,
      threshold NUMERIC,
      last_health_factor NUMERIC,
      last_alert_at TIMESTAMP
    )
  `);

  // ---- PAYMENTS_PENDING ----
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS payments_pending (
      id SERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(telegram_id),
      payment_address TEXT,
      amount_eth NUMERIC,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS wallets (
      id SERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL
        REFERENCES users(telegram_id)
        ON DELETE CASCADE,

      address TEXT NOT NULL,
      chain TEXT NOT NULL DEFAULT 'arbitrum',
      label TEXT,
      created_at TIMESTAMP DEFAULT NOW(),

      UNIQUE (user_id, address)
    )
  `);

  await dbClient.query(`
    CREATE INDEX IF NOT EXISTS idx_wallets_user_id
    ON wallets(user_id);
  `);


  console.log('✅ All tables initialized');
}

