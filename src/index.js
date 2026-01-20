// src/index.js
import { startApplication } from './app/index.js';

startApplication().catch((e) => {
  console.error('❌ Fatal error', e);
  process.exit(1);
});
