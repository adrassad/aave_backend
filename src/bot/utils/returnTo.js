import { RETURNS } from '../constants/returns.js';
import { mainKeyboard } from '../keyboards/main.keyboard.js';

export async function handleReturn(ctx) {
  const target = ctx.session.returnTo;

  // очистка
  delete ctx.session.returnTo;

  switch (target) {
    case RETURNS.MAIN_MENU:
      await ctx.reply('🏠 Главное меню', mainKeyboard());
      break;

    default:
      // если returnTo не задан
      break;
  }
}
