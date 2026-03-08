# Aave Risk Monitor Backend

Backend platform for monitoring DeFi lending positions and liquidation
risk in **Aave Protocol** across multiple blockchain networks.

The system collects on‑chain data, retrieves risk metrics directly from
Aave smart contracts, stores analytics data, and sends notifications via
a Telegram bot.

Repository: https://github.com/adrassad/aave_backend

------------------------------------------------------------------------

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

------------------------------------------------------------------------

# 🌐 Supported Networks

Currently supported networks:

-   Ethereum
-   Arbitrum
-   Avalanche

The architecture allows new networks to be added with minimal changes.

------------------------------------------------------------------------

# 🧠 System Architecture

``` mermaid
flowchart TB

subgraph USER_LAYER["User Layer"]
U1["Telegram User"]
end

subgraph BOT_LAYER["Telegram Bot"]
B1["Command Handler"]
B2["Wallet Manager"]
B3["Notification Service"]
end

subgraph API_LAYER["API Layer"]
A1["REST API"]
A2["Routes: /health /assets /prices"]
A3["Middleware: rate limit / error handler"]
end

subgraph SERVICE_LAYER["Service Layer"]
S1["User Service"]
S2["Wallet Service"]
S3["Price Service"]
S4["HealthFactor Service"]
S5["Position Collector"]
end

subgraph BLOCKCHAIN_LAYER["Blockchain Integration"]
BC1["Protocol Adapter: Aave"]
BC2["ABI Registry"]
BC3["RPC Providers"]
BC4["Smart Contract Calls"]
end

subgraph DATA_LAYER["Data Layer"]
DB["PostgreSQL"]
CACHE["Redis Cache"]
end

subgraph WORKERS["Background Jobs"]
CRON1["Price Updater"]
CRON2["Assets Updater"]
CRON3["HF Updater"]
end

U1 --> B1

B1 --> B2
B1 --> B3

B1 --> A1

A1 --> A2
A1 --> A3

A1 --> S1
A1 --> S2
A1 --> S3
A1 --> S4

S4 --> S5

S5 --> BC1
BC1 --> BC2
BC1 --> BC3
BC3 --> BC4

BC4 --> DB
S1 --> DB
S2 --> DB
S3 --> DB

S3 --> CACHE
S4 --> CACHE

CRON1 --> S3
CRON2 --> S3
CRON3 --> S4

CACHE --> A1
DB --> A1
```

------------------------------------------------------------------------

# 📊 Health Factor Monitoring

Risk metrics are retrieved directly from **Aave smart contracts**.

The backend calls:

    getUserAccountData(address user)

Example ABI:

``` javascript
const abi = [
 "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
];
```

Returned values:

-   total collateral
-   total debt
-   liquidation threshold
-   loan‑to‑value ratio
-   **health factor**

Using the protocol's own calculation guarantees the monitoring system
always matches the official Aave risk model.

------------------------------------------------------------------------

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

------------------------------------------------------------------------

# 💾 Caching Layer

Redis is used to cache frequently accessed data:

-   prices
-   assets
-   ABIs
-   wallets
-   users

Benefits:

• reduces blockchain RPC calls\
• improves response time\
• supports scaling

------------------------------------------------------------------------

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

------------------------------------------------------------------------

# 🤖 Telegram Bot

Users interact with the platform through a Telegram bot.

Commands:

    /start
    /help
    /positions
    /healthfactor
    /status

Capabilities:

• add/remove wallets\
• view DeFi positions\
• monitor liquidation risk\
• receive alerts

------------------------------------------------------------------------

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

-   API
-   Services
-   Blockchain integration
-   Data storage
-   Cache
-   Notifications

------------------------------------------------------------------------

# 🛠 Tech Stack

Backend:

-   Node.js
-   PostgreSQL
-   Redis

Blockchain:

-   EVM RPC
-   Smart contract ABI
-   Protocol adapters

Infrastructure:

-   Telegram Bot API
-   Cron workers
-   Modular architecture

------------------------------------------------------------------------

# 🔧 Installation

Clone repository:

    git clone https://github.com/adrassad/aave_backend.git

Install dependencies:

    npm install

Configure environment variables:

    .env

Run the application:

    npm start

------------------------------------------------------------------------

# 🔑 Environment Variables

Example:

    DATABASE_URL=
    REDIS_URL=

    RPC_ETHEREUM=
    RPC_ARBITRUM=
    RPC_AVALANCHE=

    TELEGRAM_BOT_TOKEN=

------------------------------------------------------------------------

# 🗺 Roadmap

Planned improvements:

• price lookup via Telegram bot\
• price alerts\
• additional DeFi protocol adapters\
• portfolio analytics\
• web dashboard

------------------------------------------------------------------------

# 🤝 Contributing

Contributions are welcome.

Possible improvements:

-   new DeFi protocols
-   new networks
-   performance improvements
-   bot features

------------------------------------------------------------------------

# 📜 License

MIT
