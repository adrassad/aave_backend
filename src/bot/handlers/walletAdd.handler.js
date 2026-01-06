const userService = require('../../services/user.service');

module.exports = async (ctx) => {
  const isPro = await userService.isPro(ctx.from.id);

  // TODO: посчитать количество кошельков пользователя
  const walletCount = 1; // временно

  if (!isPro && walletCount >= 1) {
    return ctx.reply(
      '❌ Бесплатно можно отслеживать только 1 кошелек.\n\nОформите Pro подписку.'
    );
  }

  await ctx.reply('Введите адрес кошелька:');
};
