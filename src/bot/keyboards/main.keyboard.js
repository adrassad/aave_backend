const { Markup } = require('telegraf');

function mainKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('➕ Добавить кошелек', 'wallet:add')],
    [Markup.button.callback('➖ Удалить кошелек', 'wallet:remove')],
    [Markup.button.callback('⚡ Upgrade Pro', 'subscription:upgrade')]
  ]);
}

module.exports = { mainKeyboard };
