// healthfactor.service.js

import { collectHealthFactors } from "./healthfactor.collector.js";
import {
  notifyUser,
  formatHealthFactorAlertMessage,
} from "../../integrations/private/notification.adapter.js";

export async function syncHF() {
  console.log("⏱ HealthFactor sync started");
  console.time("HF_SYNC");

  const resultMap = await collectHealthFactors({
    checkChange: true,
  });

  await Promise.allSettled(
    [...resultMap.entries()].map(([userId, walletMap]) =>
      notifyUser(
        userId,
        formatHealthFactorAlertMessage(walletMap),
        { parse_mode: "HTML" },
      ),
    ),
  );

  console.timeEnd("HF_SYNC");
}
