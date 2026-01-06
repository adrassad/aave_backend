const userRepo = require('../db/repositories/user.repo');

async function createIfNotExists(telegramId) {
  const user = await userRepo.findByTelegramId(telegramId);
  if (!user) {
    await userRepo.create(telegramId);
  }
  return user || { telegram_id: telegramId, subscription_level: 'free' };
}

async function isPro(telegramId) {
  const user = await userRepo.findByTelegramId(telegramId);
  if (!user) return false;

  if (user.subscription_level !== 'pro') return false;
  if (!user.subscription_end) return false;

  return new Date(user.subscription_end) > new Date();
}

module.exports = {
  createIfNotExists,
  isPro
};
