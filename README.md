# Aave Risk Monitor Backend

Backend platform for monitoring DeFi positions and liquidation risk in Aave Protocol across multiple blockchain networks.

The system collects on-chain data, calculates health factors, tracks positions, and sends notifications via Telegram bot.

## Features

- Multi-chain Aave monitoring
- Health Factor calculation
- DeFi position analytics
- Telegram bot interface
- REST API
- Price indexing
- Redis caching
- Background jobs (cron workers)
- Modular protocol adapters

## Supported Networks

- Ethereum
- Arbitrum
- Avalanche

## Architecture Overview

The system consists of several main components:

### API Layer

REST API for accessing platform data.

Endpoints:
