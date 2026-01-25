//src/cron/priceUpdater.cron.js
import cron from "node-cron";
import { syncPrices } from "../services/price/price.service.js";

export function startPriceSyncCron() {
  cron.schedule("*/5 * * * *", async () => {
    console.log("⏱ Updating prices...");
    try {
      await syncPrices();
      console.log("✅ Price sync completed successfully");
    } catch (e) {
      console.error("❌ Asset updater failed:", e);
    }
  });
}
