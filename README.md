# Aave Risk Monitor Backend

Backend platform for monitoring DeFi lending positions and liquidation
risk in **Aave Protocol** across multiple blockchain networks.

The system collects on‑chain data, retrieves risk metrics directly from
Aave smart contracts, stores analytics data, and sends notifications via
a Telegram bot.

Repository: https://github.com/adrassad/aave_backend

---

# 🚀 Features

• Multi‑chain Aave monitoring\
• Health Factor tracking\
• DeFi position analytics\
• Telegram bot interface\
• REST API\
• Redis caching layer\
• PostgreSQL storage\
• Background jobs for indexing\
• Modular protocol adapters

---

# 🌐 Supported Networks

Currently supported networks:

- Ethereum
- Arbitrum
- Avalanche

The architecture allows new networks to be added with minimal changes.

---

# 🧠 System Architecture

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

---

# 📊 Health Factor Monitoring

Risk metrics are retrieved directly from **Aave smart contracts**.

The backend calls:

    getUserAccountData(address user)

Example ABI:

```javascript
const abi = [
  "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
];
```

Returned values:

- total collateral
- total debt
- liquidation threshold
- loan‑to‑value ratio
- **health factor**

Using the protocol's own calculation guarantees the monitoring system
always matches the official Aave risk model.

---

# ⚙️ Background Jobs

The system includes cron workers responsible for updating system state.

Workers:

    priceUpdater
    assetsUpdater
    HFUpdater

Responsibilities:

• update asset prices\
• refresh token metadata\
• recompute health factors

---

# 💾 Caching Layer

Redis is used to cache frequently accessed data:

- metworks
- assets
- prices
- ABIs
- users
- wallets

Benefits:

• reduces blockchain RPC calls\
• improves response time\
• supports scaling

---

# 🗄 Database

Persistent storage is handled by **PostgreSQL**.

Repositories:

    asset.repo
    price.repo
    wallet.repo
    user.repo
    network.repo
    healthfactor.repo

The project uses a **repository pattern** to separate business logic
from persistence.

---

# 🤖 Telegram Bot

Users interact with the platform through a Telegram bot.

Commands:

    /start
    /help
    /support
    /positions
    /healthfactor
    /status

Capabilities:

• add/remove wallets\
• view DeFi positions\
• monitor liquidation risk\
• receive alerts

---

# 📁 Project Structure

    api/
    bot/
    blockchain/
    cache/
    config/
    cron/
    db/
    redis/
    services/

Core layers:

- API
- Services
- Blockchain integration
- Data storage
- Cache
- Notifications

---

# 🛠 Tech Stack

Backend:

- Node.js
- PostgreSQL
- Redis

Blockchain:

- EVM RPC
- Smart contract ABI
- Protocol adapters

Infrastructure:

- Telegram Bot API
- Cron workers
- Modular architecture

---

# 🔧 Installation

Clone repository:

    git clone https://github.com/adrassad/aave_backend.git

Install dependencies:

    npm install

Configure environment variables:

    .env

Run the application:

    npm start

---

# 🔑 Environment Variables

Example:

PORT_API=
BOT_TOKEN=
DATABASE_URL=
FLUSH_REDIS_ON_START=
REDIS_HOST=
REDIS_PORT=
REDIS_DB=
REDIS_PASSWORD=
ADMIN_ID=

# Ethereum Mainnet

ETHEREUM_RPC_URL=
ETHEREUM_AAVE_ADDRESSES_PROVIDER=
ETHEREUM_AAVE_POOL_DATA_PROVIDER=
ETHEREUM_EXPLORER=
ETHEREUM_EXPLORER_KEY=

# Arbitrum Mainnet

ARBITRUM_RPC_URL=
ARBITRUM_AAVE_ADDRESSES_PROVIDER=
ARBITRUM_AAVE_POOL_DATA_PROVIDER=
ARBITRUM_EXPLORER=
ARBITRUM_EXPLORER_KEY=

# Avalanche Mainnet

AVALANCHE_RPC_URL=
AVALANCHE_AAVE_ADDRESSES_PROVIDER=
AVALANCHE_AAVE_POOL_DATA_PROVIDER=
AVALANCHE_EXPLORER=
AVALANCHE_EXPLORER_KEY=

---

# 🗺 Roadmap

Planned improvements:

• price lookup via Telegram bot\
• price alerts\
• additional DeFi protocol adapters\
• portfolio analytics\
• web dashboard

---

# 🤝 Contributing

Contributions are welcome.

Possible improvements:

- new DeFi protocols
- new networks
- performance improvements
- bot features

---

# 📜 License

MIT
