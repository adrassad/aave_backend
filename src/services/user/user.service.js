// src/services/user.service.js
import { db } from "../../db/index.js";
import { setUserToCache, getUserCache } from "../../cache/user.cache.js";

/**
 * Создать пользователя, если его нет
 */
export async function createIfNotExists(user_data) {
  let user = await getUserCache(user_data.id);

  if (!user) {
    user = await db.users.findById(user_data.id);
    if (!user) {
      user = await db.users.create(user_data);
    } else {
      user = await db.users.update(user_data.id, {
        name: user_data.username,
        first_name: user_data.first_name,
        last_name: user_data.last_name,
      });
    }
    await setUserToCache(user);
  } else {
    user = await db.users.update(user_data.id, {
      name: user_data.username,
      first_name: user_data.first_name,
      last_name: user_data.last_name,
    });
    if (!user) {
      user = await db.users.create(user_data);
    }
    await setUserToCache(user);
  }

  return user;
}

/**
 * Проверка PRO-подписки
 */
export async function isPro(telegramId) {
  const user = await getUserCache(telegramId);

  if (!user) return false;
  if (user.subscription_level !== "pro") return false;
  if (!user.subscription_end) return false;

  return new Date(user.subscription_end) > new Date();
}

export async function getAllProUsers() {
  return await db.users.getAllPro();
}

/**
 * Статус пользователя (для /status)
 */
export async function getUserStatus(telegramId) {
  const user = await getUserCache(telegramId);

  if (!user) {
    return null;
  }

  const now = new Date();
  const end = user.subscription_end ? new Date(user.subscription_end) : null;

  const isActive = end ? end > now : false;

  return {
    level: user.subscription_level,
    subscriptionEnd: end,
    isActive,
  };
}

export async function loadUsersToCache() {
  const users = await db.users.findAll();
  for (const user of users) {
    await setUserToCache(user.telegram_id, user);
  }
}

export async function updateUser(user_id, user_data) {
  const user = await db.users.updateUser(user_id, user_data);
  setUserToCache(user_id, user);
  return user;
}
