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
-   **Multi-network support** (Ethereum, Polygon, Arbitrum, Optimism)
-   Real-time **token price updates**
-   **Price change alerts (\>5%)**
-   **Quick asset lookup via ticker input (e.g. BTC, ETH)**
-   **Telegram notifications**
-   **PostgreSQL** persistent storage
-   **Redis** caching layer
-   **Background workers**
-   **Localization (EN / RU)**
-   Public **REST API**

------------------------------------------------------------------------

# 🧠 System Architecture

(See original diagram)

------------------------------------------------------------------------

# 🧩 Core Services

## Asset Service

Manages **asset metadata and configuration**.

Responsibilities:

-   Maintain supported asset list
-   Store token metadata
-   Manage decimals and collateral parameters

------------------------------------------------------------------------

## Price Service

Handles **token price updates**.

Responsibilities:

-   Fetch market prices
-   Normalize price data
-   Cache prices in Redis
-   Detect price changes (\>5%)

------------------------------------------------------------------------

## Network Service

Manages **supported blockchain networks**.

Responsibilities:

-   Maintain supported chains
-   Provide RPC configuration
-   Store chain IDs

------------------------------------------------------------------------

## Wallet Service

Handles **wallet management**.

Responsibilities:

-   Add/remove wallet
-   Validate wallet format
-   Link wallet to user

------------------------------------------------------------------------

## User Service

Manages **user accounts and preferences**.

Responsibilities:

-   Create user
-   Update preferences
-   Store language settings

------------------------------------------------------------------------

## Positions Service

Fetches **user lending positions from AAVE**.

Responsibilities:

-   Fetch reserve data from AAVE
-   Calculate:
    -   total collateral
    -   total debt
    -   available borrow

------------------------------------------------------------------------

## HealthFactor Service

Calculates **liquidation risk**.

Responsibilities:

-   Calculate Health Factor based on:
    -   collateral value
    -   borrow value
    -   liquidation thresholds
-   Normalize across networks
-   Detect critical thresholds

------------------------------------------------------------------------

## Subscription Service

Manages **user subscription plans**.

Responsibilities:

-   Free / Pro plans
-   Wallet limits
-   Notification limits
-   Feature gating

------------------------------------------------------------------------

# 🔔 Notifications

The system supports:

-   Health Factor alerts
-   Price change alerts (\>5%)

------------------------------------------------------------------------

# 🌍 Internationalization

Supported languages:

-   English
-   Russian

Language is detected from Telegram settings.

------------------------------------------------------------------------

# 🔌 Public API

## Health Check

GET /health

## Assets

GET /assets

## Prices

GET /prices

## Networks

GET /networks

------------------------------------------------------------------------

# ⚙️ Background Workers

-   Price Worker (updates prices)
-   Assets Worker (updates metadata)
-   Health Factor Worker (recalculates risk)

------------------------------------------------------------------------

# 🗄 Storage

## PostgreSQL

-   users
-   wallets
-   assets
-   positions
-   subscriptions

## Redis

-   price caching
-   fast reads

------------------------------------------------------------------------

# 🔐 Security

-   No private keys stored
-   Read-only wallet tracking
-   Input validation
-   Sensitive data not exposed via API

------------------------------------------------------------------------

# 📈 Scalability

-   Stateless API
-   Horizontal scaling with workers
-   Redis for high-performance reads

------------------------------------------------------------------------

# 📜 License

MIT
