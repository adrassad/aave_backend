import "dotenv/config";
import Redis from "ioredis";

const REDIS_DB = Number(process.env.REDIS_DB) || 0;

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  db: REDIS_DB,
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: false, // сразу подключаемся
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,
  keepAlive: 60000,
  retryStrategy(times) {
    return Math.min(times * 600, 2000);
  },
  reconnectOnError(err) {
    return err.message.includes("READONLY");
  },
});

redis.on("connect", () =>
  console.log("🟢 Redis connected", new Date().toISOString()),
);
redis.on("ready", () =>
  console.log("✅ Redis ready", new Date().toISOString(), "DB:", REDIS_DB),
);
redis.on("error", (err) =>
  console.error("🔴 Redis error:", new Date().toISOString(), err.message),
);
redis.on("close", () => console.warn("⚠️ Redis connection closed"));
redis.on("reconnecting", () =>
  console.log("🔄 Redis reconnecting...", new Date().toISOString()),
);

export async function connectRedis() {
  if (redis.status === "ready") return;
  try {
    await redis.connect();

    // flushDB если нужно
    const shouldFlush =
      process.env.FLUSH_REDIS_ON_START === "true" ||
      process.env.FLUSH_REDIS_ON_START === "1";

    if (shouldFlush) {
      const before = await redis.dbsize();
      console.log(
        `🧹 Flushing Redis DB ${REDIS_DB} (keys before flush: ${before})`,
      );
      await redis.flushdb();
      const after = await redis.dbsize();
      console.log(`✅ Redis cache cleared (keys after flush: ${after})`);
    }
  } catch (err) {
    console.error(
      "⚠️ Redis connect failed:",
      new Date().toISOString(),
      err.message,
    );
  }
}
