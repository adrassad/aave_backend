// src/bot/handlers/walletDelete.handler.js
import { removeUserWallet } from '../../services/wallet.service.js';

export function walletDeleteHandler(bot) {
  bot.action(/^WALLET_DELETE:/, async (ctx) => {
    const userId = ctx.from.id;
    const walletId = Number(ctx.callbackQuery.data.split(':')[1]);

    try {
      await removeUserWallet(userId, walletId);

      await ctx.answerCbQuery('🗑 Кошелёк удалён');
      await ctx.editMessageText('✅ Кошелёк успешно удалён');
    } catch (e) {
      console.error(e);
      await ctx.answerCbQuery('❌ Ошибка');
      await ctx.reply('⚠️ Не удалось удалить кошелёк');
    }
  });
}
