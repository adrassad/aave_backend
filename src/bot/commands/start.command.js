const userService = require('../../services/user.service');
const { mainKeyboard } = require('../keyboards/main.keyboard');

module.exports = async (ctx) => {
  await userService.createIfNotExists(ctx.from.id);

  await ctx.reply(
    '👋 Добро пожаловать!\n\nУправляйте своими кошельками:',
    mainKeyboard()
  );
};
