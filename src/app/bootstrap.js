// src/app/bootstrap.js
import { initDb } from '../db/init.js';
import { bootstrapNetworksService } from '../services/bootstrapNetworks.service.js';

export async function bootstrapApp() {
  await initDb();
  await bootstrapNetworksService();
}
