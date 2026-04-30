# CryPrice Backend (Public)

Production-style Node.js backend for monitoring Aave positions and liquidation risk across multiple EVM networks.

The project combines a Telegram bot, public API, scheduled data pipelines, Redis caching, and PostgreSQL persistence in a layered architecture.

## Why this project matters

- Solves a real Web3 problem: continuous risk tracking for lending positions.
- Uses a modular architecture with clear separation of API, bot, services, blockchain adapters, and data layer.
- Demonstrates practical backend engineering: cron orchestration, cache strategy, repository pattern, and integration boundaries.

## Core capabilities

- Multi-network Aave monitoring (`Ethereum`, `Arbitrum`, `Avalanche`, `Base`).
- Health Factor collection and risk alerting.
- Price synchronization and price-change alerts.
- Telegram UX for wallets, positions, HF checks, and threshold management.
- Read-only public API endpoints for health, assets, prices, and networks.

## Tech stack

- Runtime: `Node.js` (ES modules)
- API: `Express`
- Bot: `Telegraf`
- Blockchain: `ethers`
- Storage: `PostgreSQL` (`pg`)
- Cache: `Redis` (`ioredis`)
- Jobs: `node-cron`

## High-level architecture

```text
src/
  app/                  # startup orchestration (bootstrap + runtime)
  api/                  # express server, routes, middleware
  bot/                  # telegram commands, handlers, scenes, i18n
  services/             # business logic
  blockchain/           # protocol adapters, ABI loader/registry, network registry
  db/                   # schema init + repositories
  cache/                # redis-backed cache modules
  cron/                 # periodic sync jobs
  integrations/private/ # public adapters/stubs for private infrastructure
```

### Runtime flow

1. `src/index.js` starts application.
2. `app/bootstrap.js` initializes DB and bootstrap services.
3. `app/runtime.js` runs cron jobs, Telegram bot, and API server.

## Public API

- `GET /health` - service health check
- `GET /assets` - assets grouped by enabled networks
- `GET /price/:ticker` - ticker price per network
- `GET /networks` - enabled network list

## Telegram commands

- `/start`
- `/help`
- `/status`
- `/profile`
- `/positions`
- `/healthfactor`
- `/set_threshold <value>`

## Environment configuration

Create a local `.env` (never commit it):

```env
PORT_API=3000
DATABASE_URL=postgres://user:password@localhost:5432/aave
BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_gemini_api_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

ETHEREUM_RPC_URL=
ARBITRUM_RPC_URL=
AVALANCHE_RPC_URL=
BASE_RPC_URL=

ETHEREUM_AAVE_ADDRESSES_PROVIDER=
ARBITRUM_AAVE_ADDRESSES_PROVIDER=
AVALANCHE_AAVE_ADDRESSES_PROVIDER=
BASE_AAVE_ADDRESSES_PROVIDER=
```

## Local run

```bash
npm install
node src/index.js
```

## Cron jobs

- `assetsUpdater.cron.js` - sync asset metadata
- `priceUpdater.cron.js` - sync prices + emit price alerts
- `HFUpdater.cron.js` - sync health factors + emit HF alerts

## Public vs private boundaries

This repository is intentionally adapted for public usage:

- Private infrastructure integrations are represented by adapters/stubs in `src/integrations/private`.
- Sensitive production-only logic is abstracted behind gateways.
- The codebase remains runnable for development and architecture review while keeping internal operational details private.

## Engineering highlights

- Repository pattern for DB access (`src/db/repositories`).
- Protocol adapter abstraction for blockchain integrations.
- Cache-first read paths for hot data (`assets`, `prices`, `wallets`, `users`).
- Explicit bootstrap stage for deterministic startup.
- Centralized error messaging for Telegram workflows.

## Security notes

- No private keys are stored.
- Read-only wallet tracking (no signing/transactions).
- Secrets must be managed via environment variables and rotated regularly.
- `.env` must stay out of git history.

## Roadmap ideas

- Add automated test suite (unit + integration).
- Introduce structured logging and metrics.
- Add distributed locks for cron in multi-instance deployments.
- Improve API validation and standardized error contracts.

## License

MIT
