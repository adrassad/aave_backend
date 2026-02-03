// src/redis/redis.client.js
import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: process.env.REDIS_PORT ?? 6379,
  lazyConnect: true, // 🔥 важно
  maxRetriesPerRequest: 1, // не блокировать event loop
  enableOfflineQueue: false,
});

redis.on("connect", () => {
  console.log("🟢 Redis connected");
});

redis.on("error", (err) => {
  console.error("🔴 Redis error:", err.message);
  // ❗ НЕ throw
  // ❗ НЕ process.exit
});

redis.on("close", () => {
  console.warn("🟠 Redis connection closed");
});
