import express from "express";
import cors from "cors";
import healthRoute from "./routes/health.route.js";
import assetsRoute from "./routes/assets.route.js";
import pricesRoute from "./routes/prices.route.js";
import networksRoute from "./routes/network.route.js";
import apiLimiter from "./middlewares/rateLimit.middleware.js";
import { ENV } from "../config/env.js";

export function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(cors());
  app.use(express.json());

  // middleware rate limiter
  app.use("/health", apiLimiter);
  app.use("/assets", apiLimiter);
  app.use("/price", apiLimiter);
  app.use("/networks", apiLimiter);

  // **подключаем роуты**
  app.use("/health", healthRoute);
  app.use("/assets", assetsRoute);
  app.use("/price", pricesRoute);
  app.use("/networks", networksRoute);

  app.listen(ENV.PORT_API, () => {
    console.log(`🚀 Backend running on http://localhost:${ENV.PORT_API}`);
  });

  return app;
}
