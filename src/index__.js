// src/index.js
import { initDb } from './db/init.js';
import { initAssets } from './services/assets.init.js';
import { startCrons } from './cron/index.js';
import { startServer } from './api/server.js';
import { startBot } from './bot/bot.js';

// Blockchain facade
import * as blockchain from './blockchain/index.js';
import { ethers } from 'ethers';
import { bootstrapNetworksService } from './services/bootstrap.service.js';

async function bootstrap() {
  try {
    // 1️⃣ Инициализация базы данных
    await initDb();

    // Заполнение ключевых параметров в БД
    await bootstrapNetworksService(); 

    // 2️⃣ Инициализация активов
    //await initAssets();

    // 3️⃣ Запуск CRON задач
    //startCrons();

    // 4️⃣ Запуск HTTP-сервера
    //startServer();

    // 5️⃣ Запуск бота
    //startBot();

    console.log('✅ Bootstrap finished');
  } catch (e) {
    console.error('❌ Failed to start:', e);
    process.exit(1);
  }
}

bootstrap();
