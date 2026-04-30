import { createIfNotExists, updateUser } from "../../services/user/user.service.js";
import { lanhuage } from "../locales/index.js";

const MIN_THRESHOLD = 0.1;
const MAX_THRESHOLD = 10;

function parseThreshold(rawValue) {
  const value = Number(String(rawValue ?? "").replace(",", "."));
  if (!Number.isFinite(value)) return null;
  if (value < MIN_THRESHOLD || value > MAX_THRESHOLD) return null;
  return value;
}

export function setThresholdCommand(bot) {
  bot.command("set_threshold", async (ctx) => {
    const args = ctx.message.text.trim().split(/\s+/);
    const parsed = parseThreshold(args[1]);

    if (parsed === null) {
      return ctx.reply(lanhuage(ctx.from.language_code, "threshold_usage"));
    }

    await createIfNotExists(ctx.from);

    const updatedUser = await updateUser(ctx.from.id, {
      threshold_hf: parsed,
    });

    if (!updatedUser) {
      return ctx.reply(lanhuage(ctx.from.language_code, "error"));
    }

    return ctx.reply(
      `${lanhuage(ctx.from.language_code, "threshold_saved")} ${parsed.toFixed(2)}`,
    );
  });
}
