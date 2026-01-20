// src/app/index.js
import { bootstrapApp } from './bootstrap.js';
import { startRuntime } from './runtime.js';

export async function startApplication() {
  await bootstrapApp();
  await startRuntime();
}
