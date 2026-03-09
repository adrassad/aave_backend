// src/config/env.js
import "dotenv/config";

export const ENV = {
  PORT_API: Number(process.env.PORT_API ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL,
  BOT_TOKEN: process.env.BOT_TOKEN,
};
