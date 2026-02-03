// src/app/index.js
import { bootstrapApp } from "./bootstrap.js";
import { startRuntime } from "./runtime.js";
import { connectRedis } from "../redis/redis.client.js";

export async function startApplication() {
  await connectRedis();
  await bootstrapApp();
  await startRuntime();
}
