import { Scenes, Markup } from 'telegraf';
import { SCENES } from '../constants/scenes.js';
import { BUTTONS } from '../constants/buttons.js';
import { addUserWallet } from '../../services/wallet.service.js';

export const addWalletScene = new Scenes.BaseScene(SCENES.ADD_WALLET);

addWalletScene.enter(async (ctx) => {
  await ctx.reply(
    '➕ Отправьте адрес кошелька Ethereum / Arbitrum\n\n' +
    'Пример:\n`0x1234...abcd`',
    { parse_mode: 'Markdown' }
  );
});

addWalletScene.command('cancel', async (ctx) => {
  await ctx.reply('❌ Добавление кошелька отменено');
  await ctx.scene.leave();
});

addWalletScene.on('text', async (ctx) => {
  const text = ctx.message.text.trim();

  // ❗ ИГНОРИРУЕМ КНОПКИ МЕНЮ
  if (Object.values(BUTTONS).includes(text)) {
    await ctx.reply('ℹ️ Завершите добавление кошелька или отправьте /cancel');
    return;
  }

  // ❗ ИГНОРИРУЕМ КОМАНДЫ
  if (text.startsWith('/')) {
    return ctx.reply('❗ Отправьте адрес кошелька или /cancel');
  }

  try {
    await addUserWallet(ctx.from.id, text);
    await ctx.reply('✅ Кошелёк успешно добавлен');
    await ctx.scene.leave();
  } catch (e) {
    switch (e.message) {
      case 'INVALID_ADDRESS':
        await ctx.reply(
        '❌ Невалидный адрес.\n\n' +
        'Отправьте адрес кошелька Ethereum или /cancel'
        );
        break;
      case 'WALLET_ALREADY_EXISTS':
        await ctx.reply('⚠️ Этот кошелёк уже добавлен.');
        break;

      case 'FREE_LIMIT_REACHED':
        await ctx.reply(
          '❌ Бесплатно можно добавить только 1 кошелёк.\n\n' +
          'Оформите Pro подписку.',
          Markup.inlineKeyboard([
            Markup.button.callback('⭐ Upgrade to Pro', 'PRO_UPGRADE')
          ])
        );
        await ctx.scene.leave();
        break;

      default:
        console.error(e);
        await ctx.reply('⚠️ Ошибка при добавлении кошелька.');
        await ctx.scene.leave();
    }
  }
});
