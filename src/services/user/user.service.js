// src/services/user.service.js
import { db } from "../../db/index.js";
import {
  setUserToCache,
  getUserCache,
  getUsersPageFromCache,
  setUsersToCache,
} from "../../cache/user.cache.js";

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
        username: user_data.username,
        first_name: user_data.first_name,
        last_name: user_data.last_name,
      });
    }
    await setUserToCache(user.telegram_id, user);
  } else {
    user = await db.users.update(user_data.id, {
      username: user_data.username,
      first_name: user_data.first_name,
      last_name: user_data.last_name,
    });
    if (!user) {
      user = await db.users.create(user_data);
    }
    await setUserToCache(user.telegram_id, user);
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

export async function getAllUsers() {
  const users = await getUsersPageFromCache();
  if (!users) {
    return await db.users.findAll();
  }
  return users;
}
export async function getAllUsersDb() {
  const users = await db.users.findAll();
  setUsersToCache(users);
  return users;
}

export async function getAllProUsers() {
  const users = await getAllUsers();
  return users.filter((u) => u.subscription_level === "pro");
}

/**
 * Статус пользователя (для /status)
 */
export async function getUserProfile(telegramId) {
  let user = await getUserCache(telegramId);

  if (!user) {
    user = await db.users.findById(telegramId);
    if (!user) return null;

    await setUserToCache(user.telegram_id, user);
  }

  const now = new Date();
  const end = user.subscription_end ? new Date(user.subscription_end) : null;

  const isActive = end ? end > now : false;

  return {
    telegram_id: user.telegram_id,
    username: user.username,
    level: user.subscription_level,
    subscriptionEnd: end,
    isActive,
    threshold_hf: user.threshold_hf,
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

export async function getUserStatus(telegramId) {
  return getUserProfile(telegramId);
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
