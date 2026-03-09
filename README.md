# AAVE Health Factor Bot

Telegram bot and backend service for monitoring **AAVE positions and Health Factor** across multiple networks.

The system tracks wallet positions, calculates risk metrics and sends notifications when a Health Factor approaches liquidation thresholds.

---

# 🚀 Features

- Track **AAVE positions**
- Monitor **Health Factor**
- Multi-network support
- Real-time **price updates**
- **Telegram notifications**
- **PostgreSQL storage**
- **Redis caching**
- **Background workers**
- **Localization (EN / RU)**
- Public **REST API**

---

# 🧠 System Architecture

```mermaid
flowchart TB

%% USERS
subgraph USERS["Users"]
U1["Telegram User"]
U2["External API Client"]
end

%% ENTRY LAYER
subgraph ENTRY["Entry Layer"]
TG["Telegram Bot"]
API["REST API"]
end

%% BOT INTERNAL
subgraph BOT["Bot Layer"]
CMD["Command Handlers"]
SCENES["Scenes / User Flows"]
I18N["Localization (EN / RU)"]
NOTIFY["Notification Service"]
end

%% DOMAIN SERVICES
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

%% BLOCKCHAIN
subgraph BC["Blockchain Integration"]
ADAPTER["Protocol Adapter (Aave)"]
ABI["ABI Registry"]
RPC["RPC Providers"]
CONTRACT["Smart Contract Calls"]
end

%% DATA
subgraph DATA["Data Layer"]
POSTGRES["PostgreSQL"]
REDIS["Redis Cache"]
end

%% WORKERS
subgraph WORKERS["Background Workers"]
CRON1["Price Updater"]
CRON2["Assets Updater"]
CRON3["HF Updater"]
end

%% FLOWS

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

# 📦 Project Structure

src
├── api
│ └── routes
│ ├── health.route.js
│ ├── assets.route.js
│ ├── price.route.js
│ └── networks.route.js
│
├── bot
│ ├── commands
│ ├── scenes
│ ├── notifications
│ └── locales
│ ├── en.js
│ └── ru.js
│
├── services
│ ├── asset
│ │ └── asset.service.js
│ ├── healthfactor
│ │ └── healthfactor.service.js
│ ├── network
│ │ └── network.service.js
│ ├── positions
│ │ └── position.service.js
│ ├── price
│ │ └── price.service.js
│ ├── subscription
│ │ └── subscription.service.js
│ ├── user
│ │ └── user.service.js
│ └── wallet
│ └── wallet.service.js
│
├── blockchain
│ ├── adapters
│ │ └── aave.adapter.js
│ ├── abi
│ └── providers
│
├── workers
│ ├── price.worker.js
│ ├── assets.worker.js
│ └── hf.worker.js
│
└── database
├── postgres
└── redis

# 🧩 Services

Asset Service

Manages asset metadata.

Responsibilities:

asset list

asset configuration

supported tokens

decimals

collateral parameters

src/services/asset/asset.service.js
Price Service

Handles token price updates.

Responsibilities:

fetch prices

normalize price data

cache prices in Redis

src/services/price/price.service.js
Network Service

Manages supported blockchain networks.

Responsibilities:

network configuration

RPC endpoints

chain ids

src/services/network/network.service.js
Wallet Service

Handles wallet management.

Responsibilities:

add wallet

remove wallet

validate wallet

link wallet to user

src/services/wallet/wallet.service.js
User Service

Handles user accounts.

Responsibilities:

create user

update preferences

language settings

src/services/user/user.service.js
Positions Service

Fetches user positions from AAVE.

Responsibilities:

fetch reserves

calculate collateral

calculate borrow positions

src/services/positions/position.service.js
HealthFactor Service

Calculates user liquidation risk.

Responsibilities:

compute Health Factor

detect liquidation risk

trigger alerts

src/services/healthfactor/healthfactor.service.js
Subscription Service

Manages user subscription plans.

Responsibilities:

free/pro plans

wallet limits

notification limits

src/services/subscription/subscription.service.js

# 🌍 Internationalization

The bot supports multiple languages.

Supported languages:

English

Russian

Localization files are located in:

bot/locales/
├── en.js
└── ru.js

Language is automatically detected from the Telegram user settings.

# 🔌 Public API

The backend exposes a small public API.

Health Check
GET /health

Response:

OK
Assets
GET /assets

Returns supported tokens.

Prices
GET /prices

Returns current token prices.

Networks
GET /networks

Returns supported blockchain networks.

Sensitive user data such as:

wallets

positions

health factors

is not publicly exposed and is only accessed internally by the Telegram bot.

# ⚙️ Background Workers

Workers update blockchain and market data.

Price Worker

Updates token prices.

src/workers/price.worker.js
Assets Worker

Updates asset metadata.

src/workers/assets.worker.js
Health Factor Worker

Recalculates Health Factors for tracked wallets.

src/workers/hf.worker.js

# 🗄 Storage

PostgreSQL

Stores:

users

wallets

assets

positions

subscriptions

Redis

Used for:

price caching

fast reads

temporary blockchain data

# 🔐 Security

Sensitive user information is not exposed through public APIs.

Wallet tracking and Health Factor calculations are performed internally by the bot.

# 📜 License

MIT
