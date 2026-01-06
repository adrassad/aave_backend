const walletAdd = require('./handlers/walletAdd.handler');
const walletRemove = require('./handlers/walletRemove.handler');
const upgrade = require('./handlers/upgrade.handler');

module.exports = (bot) => {
  bot.action('wallet:add', walletAdd);
  bot.action('wallet:remove', walletRemove);
  bot.action('subscription:upgrade', upgrade);
};
