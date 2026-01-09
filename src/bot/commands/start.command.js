import { createIfNotExists } from '../../services/user.service.js';
import { mainKeyboard } from '../keyboards/main.keyboard.js';

export function startCommand(bot) {
  bot.start(async (ctx) => {
    if (ctx.scene?.current) {
      await ctx.scene.leave();
    }
    await createIfNotExists(ctx.from.id);

    await ctx.reply(
    `👋 Добро пожаловать!\n\n
      🤖 Aave Health Monitor

Я отслеживаю health factor ваших кошельков в Aave (Arbitrum)
и присылаю уведомление, если он падает ниже заданного значения.

🔔 Уведомления 24/7
💼 Поддержка нескольких кошельков
⚡ Pro-подписка для расширенных возможностей`,
      mainKeyboard()
    );
  });
}
