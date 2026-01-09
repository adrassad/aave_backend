export async function proUpgradeHandler(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(
    '⭐ Pro подписка\n\n' +
    '— до 10 кошельков\n' +
    '— уведомления\n' +
    '— приоритетная поддержка\n\n' +
    'Стоимость: 0.05 ETH\n\n' +
    '⚡ В разработке'
  );
}
