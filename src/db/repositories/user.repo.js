const db = require('../index');

async function findByTelegramId(telegramId) {
  const res = await db.query(
    `SELECT * FROM users WHERE telegram_id = $1`,
    [telegramId]
  );
  return res.rows[0];
}

async function create(telegramId) {
  await db.query(
    `INSERT INTO users (telegram_id, subscription_level)
     VALUES ($1, 'free')
     ON CONFLICT (telegram_id) DO NOTHING`,
    [telegramId]
  );
}

async function updateSubscription(telegramId, level, endDate) {
  await db.query(
    `UPDATE users
     SET subscription_level = $2, subscription_end = $3
     WHERE telegram_id = $1`,
    [telegramId, level, endDate]
  );
}

module.exports = {
  findByTelegramId,
  create,
  updateSubscription
};
