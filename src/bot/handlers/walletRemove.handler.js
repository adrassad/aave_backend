import { BUTTONS } from '../constants/buttons.js';
import { SCENES } from '../constants/scenes.js';
import { RETURNS } from '../constants/returns.js';

export function walletRemoveHandler(bot) {
  bot.hears(BUTTONS.REMOVE_WALLET, async (ctx) => {
    ctx.session.returnTo = RETURNS.MAIN_MENU;
    await ctx.scene.enter(SCENES.REMOVE_WALLET);
  });
}
