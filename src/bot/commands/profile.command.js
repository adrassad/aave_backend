import {
  createIfNotExists,
  getUserProfile,
} from "../../services/user/user.service.js";
import { lanhuage } from "../locales/index.js";

export function profileCommand(bot) {
  bot.command("profile", async (ctx) => {
    await createIfNotExists(ctx.from);

    const profile = await getUserProfile(ctx.from.id);
    if (!profile) {
      return ctx.reply(lanhuage(ctx.from.language_code, "no_user"));
    }

    const threshold = Number(profile.threshold_hf);
    const thresholdText = Number.isFinite(threshold)
      ? threshold.toFixed(2)
      : "1.20";

    const text =
      `${lanhuage(ctx.from.language_code, "profile_title")}\n` +
      `ID: ${profile.telegram_id}\n` +
      `${lanhuage(ctx.from.language_code, "profile_username")} ${profile.username || "—"}\n` +
      `${lanhuage(ctx.from.language_code, "profile_threshold")} ${thresholdText}`;

    return ctx.reply(text);
  });
}
