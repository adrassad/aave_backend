// src/config/env.js
import "dotenv/config";

export const ENV = {
  PORT_API: Number(process.env.PORT_API ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL,
  BOT_TOKEN: process.env.BOT_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  GEMINI_FALLBACK_MODEL:
    process.env.GEMINI_FALLBACK_MODEL || "gemini-2.0-flash",
};
