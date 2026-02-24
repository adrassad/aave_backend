//src/bot/commands/healthfactor.command.js
import { Markup } from "telegraf";
import { getUserWallets } from "../../services/wallet/wallet.service.js";
import { formatHealthFactorOverview } from "../utils/hfFormatter.js";
import { collectHealthFactors } from "../../services/healthfactor/healthfactor.collector.js";
import { assertCanViewPositions } from "../../services/subscription/subscription.service.js";

export function healthFactorCommand(bot) {
  bot.command("healthfactor", async (ctx) => {
    const userId = ctx.from.id;
    // 🔐 Проверка подписки
    await assertCanViewPositions(userId);

    const wallets = await getUserWallets(userId);

    if (!wallets.size) {
      return ctx.reply(
        "⚠️ У вас ещё нет кошельков. Добавьте через ➕ Add Wallet.",
      );
    }

    const buttons = [];

    for (const [address, wallet] of wallets) {
      buttons.push(
        Markup.button.callback(address, `wallet_healthfactor:${address}`),
      );
    }

    await ctx.reply(
      "💼 Выберите кошелек для получения healthfactor на Aave:",
      Markup.inlineKeyboard(buttons, { columns: 1 }),
    );
  });

  bot.action(/wallet_healthfactor:(.+)/, async (ctx) => {
    const address = ctx.match[1];
    const userId = ctx.from.id;

    await ctx.answerCbQuery();

    const resultMap = await collectHealthFactors({
      userId,
      address,
      checkChange: false,
    });

    const walletMap = resultMap.get(userId);

    if (!walletMap) {
      return ctx.reply("❌ Кошелек не найден");
    }

    const message = formatHealthFactorOverview(walletMap);

    await ctx.reply(message, { parse_mode: "HTML" });
  });
}
