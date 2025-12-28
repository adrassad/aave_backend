# Aave DeFi Analytics Backend

> A Web3 analytics backend that indexes DeFi protocol data and historical prices to provide real-time portfolio metrics and risk analysis.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Architecture](#architecture)  
4. [Tech Stack](#tech-stack)  
5. [Installation](#installation)  
6. [Environment Variables](#environment-variables)  
7. [Usage / API Endpoints](#usage--api-endpoints)  
8. [Cron Jobs](#cron-jobs)  
9. [Database Schema](#database-schema)  
10. [Caching](#caching)  
11. [License](#license)  

---

## Project Overview

This project is a **Node.js backend** that indexes Aave protocol data on the **Arbitrum network**.  
It collects:

- **Historical asset prices** from Aave Oracle  
- **List of supported tokens**  
- **Supply and borrow positions** per wallet for calculating health factors  

The data is stored in **PostgreSQL** and served via a **REST API** for analytics and portfolio management applications.  
It also implements a **cron-based updater** to refresh prices every minute and keeps an **in-memory cache** for fast API responses.

---

## Features

- Fetch **real-time and historical prices** for Aave assets  
- List all **supported tokens**  
- Track **supply and borrow positions** per wallet  
- Calculate **health factor** for user portfolios  
- **Cron jobs** for periodic price updates  
- **Cache layer** for fast API responses  
- Designed for **production-ready scaling**  

---

## Architecture
[Frontend / Mobile App]
│ HTTP
▼
[Node.js Backend API]
│ ethers.js / RPC
▼
[Arbitrum Blockchain / Aave]
│
▼
[PostgreSQL Database]
│
▼
[Historical Prices / Analytics]
│
▼
[Cache]

- **Services** handle business logic  
- **Blockchain modules** handle smart contract interactions  
- **Cron jobs** handle periodic data updates  
- **Cache layer** for frequently requested data  

---

## Tech Stack

| Layer                 | Technology |
|----------------------|------------|
| Backend              | Node.js, Express |
| Blockchain           | ethers.js (Arbitrum, Aave v3) |
| Database             | PostgreSQL |
| Task Scheduling      | node-cron |
| Environment Config   | dotenv |
| Caching              | In-memory (future Redis support) |

---

## Installation

```bash
git clone https://github.com/yourusername/aave-backend.git
cd aave-backend
npm install
