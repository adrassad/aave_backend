import { Telegraf } from 'telegraf';
import { registerCommands } from './commands/index.js';
import { registerHandlers } from './handlers/index.js';

let bot;

export function startBot() {
  if (bot) return bot;

  bot = new Telegraf(process.env.BOT_TOKEN);

  registerCommands(bot);
  registerHandlers(bot);

  bot.launch();

  console.log('🤖 Telegram bot started');

  return bot;
}
