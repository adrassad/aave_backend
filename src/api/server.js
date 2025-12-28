import express from 'express';
import cors from 'cors';
import assetsRoute from './routes/assets.route.js';
import pricesRoute from './routes/prices.route.js';
import { ENV } from '../config/env.js';

export function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/assets', assetsRoute);
  app.use('/price', pricesRoute);

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${ENV.PORT}`);
  });

  return app;
}
