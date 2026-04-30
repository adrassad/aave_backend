import {
  notifyUser,
  formatPriceAlertMessage,
} from "../../integrations/private/notification.adapter.js";
import { getAllProUsers } from "../user/user.service.js";

export async function processPriceAlerts(alerts) {
  const message = formatPriceAlertMessage(alerts);
  for (const user of await getAllProUsers()) {
    await notifyUser(user.telegram_id, message, {
      parse_mode: "HTML",
    });
  }
}

export function messagePriceAlert(alerts) {
  return formatPriceAlertMessage(alerts);
}
