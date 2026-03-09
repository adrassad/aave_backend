# AAVE Health Factor Bot

A **Telegram bot and backend service** for monitoring **AAVE lending
positions and Health Factor risk** across multiple blockchain networks.

The system tracks user wallets, analyzes collateral and borrow
positions, calculates liquidation risk, and sends **Telegram
notifications** when a Health Factor approaches critical thresholds.

------------------------------------------------------------------------

# 🚀 Features

-   Monitor **AAVE lending positions**
-   Track **Health Factor** and liquidation risk
-   **Multi‑network support**
-   Real‑time **token price updates**
-   **Telegram notifications**
-   **PostgreSQL** persistent storage
-   **Redis** caching layer
-   **Background workers**
-   **Localization (EN / RU)**
-   Public **REST API**

------------------------------------------------------------------------

# 🧠 System Architecture

``` mermaid
flowchart TB

subgraph USERS["Users"]
U1["Telegram User"]
U2["External API Client"]
end

subgraph ENTRY["Entry Layer"]
TG["Telegram Bot"]
API["REST API"]
end

subgraph BOT["Bot Layer"]
CMD["Command Handlers"]
SCENES["Scenes / User Flows"]
I18N["Localization"]
NOTIFY["Notification Service"]
end

subgraph DOMAIN["Domain Services"]
US["User Service"]
WS["Wallet Service"]
AS["Asset Service"]
NS["Network Service"]
PS["Price Service"]
POS["Positions Service"]
HF["HealthFactor Service"]
SUB["Subscription Service"]
end

subgraph BC["Blockchain Integration"]
ADAPTER["AAVE Adapter"]
ABI["ABI Registry"]
RPC["RPC Providers"]
CONTRACT["Smart Contract Calls"]
end

subgraph DATA["Data Layer"]
POSTGRES["PostgreSQL"]
REDIS["Redis"]
end

subgraph WORKERS["Background Workers"]
CRON1["Price Worker"]
CRON2["Assets Worker"]
CRON3["HealthFactor Worker"]
end

U1 --> TG
U2 --> API

TG --> CMD
CMD --> SCENES
CMD --> I18N
CMD --> NOTIFY

CMD --> WS
CMD --> POS
CMD --> HF

API --> US
API --> WS
API --> PS
API --> AS
API --> NS
API --> POS
API --> HF
API --> SUB

POS --> ADAPTER
HF --> ADAPTER

ADAPTER --> ABI
ADAPTER --> RPC
RPC --> CONTRACT

CONTRACT --> POSTGRES

US --> POSTGRES
WS --> POSTGRES
AS --> POSTGRES
NS --> POSTGRES
PS --> POSTGRES
SUB --> POSTGRES

PS --> REDIS
AS --> REDIS
HF --> REDIS

CRON1 --> PS
CRON2 --> AS
CRON3 --> HF

REDIS --> API
POSTGRES --> API
```

------------------------------------------------------------------------

# 📦 Project Structure

    src
    ├── api
    │   └── routes
    │       ├── health.route.js
    │       ├── assets.route.js
    │       ├── price.route.js
    │       └── networks.route.js
    │
    ├── bot
    │   ├── commands
    │   ├── scenes
    │   ├── notifications
    │   └── locales
    │       ├── en.js
    │       └── ru.js
    │
    ├── services
    │   ├── asset
    │   │   └── asset.service.js
    │   ├── healthfactor
    │   │   └── healthfactor.service.js
    │   ├── network
    │   │   └── network.service.js
    │   ├── positions
    │   │   └── position.service.js
    │   ├── price
    │   │   └── price.service.js
    │   ├── subscription
    │   │   └── subscription.service.js
    │   ├── user
    │   │   └── user.service.js
    │   └── wallet
    │       └── wallet.service.js
    │
    ├── blockchain
    │   ├── adapters
    │   │   └── aave.adapter.js
    │   ├── abi
    │   └── providers
    │
    ├── workers
    │   ├── price.worker.js
    │   ├── assets.worker.js
    │   └── hf.worker.js
    │
    └── database
        ├── postgres
        └── redis

------------------------------------------------------------------------

# 🧩 Core Services

## Asset Service

Manages **asset metadata and configuration**.

Responsibilities:

-   Maintain supported asset list
-   Store token metadata
-   Manage decimals and collateral parameters

Path:

    src/services/asset/asset.service.js

------------------------------------------------------------------------

## Price Service

Handles **token price updates**.

Responsibilities:

-   Fetch market prices
-   Normalize price data
-   Cache prices in Redis

Path:

    src/services/price/price.service.js

------------------------------------------------------------------------

## Network Service

Manages **supported blockchain networks**.

Responsibilities:

-   Network configuration
-   RPC endpoints
-   Chain IDs

Path:

    src/services/network/network.service.js

------------------------------------------------------------------------

## Wallet Service

Handles **wallet management**.

Responsibilities:

-   Add wallet
-   Remove wallet
-   Validate wallet format
-   Link wallet to user

Path:

    src/services/wallet/wallet.service.js

------------------------------------------------------------------------

## User Service

Manages **user accounts and preferences**.

Responsibilities:

-   Create user
-   Update preferences
-   Store language settings

Path:

    src/services/user/user.service.js

------------------------------------------------------------------------

## Positions Service

Fetches **user lending positions from AAVE**.

Responsibilities:

-   Fetch reserves
-   Calculate collateral
-   Calculate borrow positions

Path:

    src/services/positions/position.service.js

------------------------------------------------------------------------

## HealthFactor Service

Calculates **liquidation risk**.

Responsibilities:

-   Compute Health Factor
-   Detect liquidation risk
-   Trigger alerts

Path:

    src/services/healthfactor/healthfactor.service.js

------------------------------------------------------------------------

## Subscription Service

Manages **user subscription plans**.

Responsibilities:

-   Free / Pro plans
-   Wallet limits
-   Notification limits

Path:

    src/services/subscription/subscription.service.js

------------------------------------------------------------------------

# 🌍 Internationalization

The bot supports multiple languages.

Supported languages:

-   English
-   Russian

Localization files:

    src/bot/locales
    ├── en.js
    └── ru.js

Language is automatically detected from **Telegram user settings**.

------------------------------------------------------------------------

# 🔌 Public API

The backend exposes a small **public REST API**.

## Health Check

    GET /health

Response:

    OK

------------------------------------------------------------------------

## Assets

    GET /assets

Returns the list of **supported tokens**.

------------------------------------------------------------------------

## Prices

    GET /prices

Returns current **token prices**.

------------------------------------------------------------------------

## Networks

    GET /networks

Returns supported **blockchain networks**.

------------------------------------------------------------------------

Sensitive user data such as:

-   wallets
-   positions
-   health factors

is **not publicly exposed** and is only used internally by the Telegram
bot.

------------------------------------------------------------------------

# ⚙️ Background Workers

Workers continuously update blockchain and market data.

## Price Worker

Updates token prices.

    src/workers/price.worker.js

## Assets Worker

Updates asset metadata.

    src/workers/assets.worker.js

## Health Factor Worker

Recalculates Health Factors for tracked wallets.

    src/workers/hf.worker.js

------------------------------------------------------------------------

# 🗄 Storage

## PostgreSQL

Stores:

-   users
-   wallets
-   assets
-   positions
-   subscriptions

## Redis

Used for:

-   price caching
-   fast reads
-   temporary blockchain data

------------------------------------------------------------------------

# 🔐 Security

Sensitive user information is **never exposed via public APIs**.

Wallet tracking and Health Factor calculations are performed
**internally by the bot services**.

------------------------------------------------------------------------

# 📜 License

MIT
