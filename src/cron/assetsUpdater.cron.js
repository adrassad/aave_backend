// src/cron/assetsUpdater.cron.js
import cron from "node-cron";
import { syncAssets } from "../services/asset/asset.service.js";

let isRunning = false;

export async function startAssetSyncCron() {
  if (isRunning) {
    console.log("⏭ Asset sync already running");
    return;
  }
  isRunning = true;

  console.log("⏱ Updating assets...");

  try {
    await syncAssets();
    console.log("✅ Asset sync completed successfully");
  } catch (e) {
    console.error("❌ Asset updater failed:", e);
  } finally {
    isRunning = false;
  }
}

// 🚀 1. запуск сразу при старте приложения
startAssetSyncCron();

// ⏱ 2. запуск каждый час
cron.schedule("0 * * * *", startAssetSyncCron);
