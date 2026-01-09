// src/bot/handlers/walletRemove.handler.js
import { BUTTONS } from '../constants/buttons.js';
import { SCENES } from '../constants/scenes.js';

export function walletRemoveHandler(bot) {
  console.log('REMOVE_WALLET scene =', SCENES.REMOVE_WALLET);

  bot.hears(BUTTONS.REMOVE_WALLET, async (ctx) => {
    ctx.session.returnTo = RETURNS.MAIN_MENU;
    await ctx.scene.enter(SCENES.REMOVE_WALLET);
  });
}
