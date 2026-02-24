// src/db/index.js
import { PostgresClient } from "./postgres.client.js";
import { UserRepository } from "./repositories/user.repo.js";
import { NetworkRepository } from "./repositories/network.repo.js";
import { AssetRepository } from "./repositories/asset.repo.js";
import { PriceRepository } from "./repositories/price.repo.js";
import { WalletRepository } from "./repositories/wallet.repo.js";
import { HFRepository } from "./repositories/healthfactor.repo.js";

const dbClient = new PostgresClient();

export const db = {
  users: new UserRepository(dbClient),
  networks: new NetworkRepository(dbClient),
  assets: new AssetRepository(dbClient),
  prices: new PriceRepository(dbClient),
  wallets: new WalletRepository(dbClient),
  hf: new HFRepository(dbClient),
};
