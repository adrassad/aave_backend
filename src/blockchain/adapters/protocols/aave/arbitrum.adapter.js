// src/blockchain/adapters/protocols/aave/arbitrum.adapter.js
import { Contract, getAddress } from "ethers";
import { AaveBaseAdapter } from "../base.protocol.js";
import { Aave } from "../../../abi/index.js";
import { getTokenMetadata } from "../../../helpers/tokenMetadata.js";
import { isAddress } from "ethers";

const UI_POOL_DATA_PROVIDER = "0x145de30c929a065582da84cf96f88460db9745a7";

export class AaveArbitrumAdapter extends AaveBaseAdapter {
  constructor({ provider, config }) {
    super({ provider, config });

    if (!config.ADDRESSES_PROVIDER) {
      throw new Error("Aave ADDRESSES_PROVIDER not configured");
    }

    const correctAddress = getAddress(config.ADDRESSES_PROVIDER);
    //console.log("correctAddress: ", correctAddress);
    this.addressesProvider = new Contract(
      correctAddress,
      Aave.PoolAddressesProviderV3.POOL_ADDRESSES_PROVIDER_V3_ABI,
      provider,
    );
  }

  async getPool() {
    if (!this.pool) {
      const poolAddress = await this.addressesProvider.getPool();
      this.pool = new Contract(
        poolAddress,
        Aave.AavePoolV3.AAVE_POOL_V3_ABI,
        this.provider,
      );
    }
    return this.pool;
  }

  async getOracle() {
    if (!this.oracle) {
      const oracleAddress = await this.addressesProvider.getPriceOracle();
      //console.log("getOracle oracleAddress", oracleAddress);
      this.oracle = new Contract(
        oracleAddress,
        Aave.Oracle.AAVE_ORACLE_ABI,
        this.provider,
      );
      //this.baseCurrencyDecimals = await this.oracle.BASE_CURRENCY_DECIMALS();
    }
    return this.oracle;
  }

  async getDataProvider() {
    if (!this.dataProvider) {
      const address = await this.addressesProvider.getPoolDataProvider();
      this.dataProvider = new Contract(
        address,
        Aave.DataProvider.AAVE_DATA_PROVIDER_ABI,
        this.provider,
      );
    }
    return this.dataProvider;
  }

  async getAssets() {
    const pool = await this.getPool();
    const reserves = await pool.getReservesList();

    const assets = await Promise.all(
      reserves.map((address) =>
        getTokenMetadata(address, this.provider).catch(() => null),
      ),
    );
    // ❗️отсекаем битые токены
    return assets.filter(Boolean);
  }

  async getPrices(assets) {
    //console.log("ARBITRUM getPrices: ");
    const ORACLE_DECIMALS = 8;
    const oracle = await this.getOracle();

    const prices = {};

    // ⚡ параллельные запросы
    await Promise.all(
      assets.map(async (asset) => {
        const { address, symbol } = asset;

        // 🛡 защита
        if (!address || !isAddress(address)) {
          console.warn("Invalid address:", address);
          return;
        }

        try {
          const rawPrice = await oracle.getAssetPrice(address);

          // иногда oracle возвращает 0 — это не ошибка
          if (!rawPrice || rawPrice === 0n) return;

          prices[address.toLowerCase()] = {
            address,
            symbol,
            price: Number(rawPrice) / 10 ** ORACLE_DECIMALS,
          };
        } catch (e) {
          console.warn(
            `⚠️ Price fetch failed for ${symbol} (${address}):`,
            e.shortMessage || e.message,
          );
        }
      }),
    );
    // console.log("getPrices prices", prices);
    return prices;
  }

  async getUserPositions1(userAddress) {
    const dataProvider = await this.getDataProvider();
    const pool = await this.getPool();
    const reserves = await pool.getReservesList();
    const positions = [];

    await Promise.all(
      reserves.map(async (asset) => {
        try {
          const data = await dataProvider.getUserReserveData(
            asset,
            userAddress,
          );
          //console.log("getUserPositions data: ", data);
          const [
            aTokenBalance,
            stableDebt,
            variableDebt,
            ,
            ,
            ,
            ,
            ,
            collateral,
          ] = data;

          // если нет позиции — пропускаем
          if (
            aTokenBalance === 0n &&
            stableDebt === 0n &&
            variableDebt === 0n
          ) {
            return;
          }
          //const dataAsset = await getTokenMetadata(asset, this.provider);
          positions.push({
            assetAddress: asset,
            aTokenBalance,
            stableDebt,
            variableDebt,
            collateral,
          });
        } catch (e) {
          console.warn("Reserve read failed:", asset, e);
        }
      }),
    );

    // 🔹 healthFactor берём из Pool
    const { healthFactor } = await pool.getUserAccountData(userAddress);

    return {
      positions,
      healthFactor: Number(healthFactor) / 1e18,
    };
  }

  async getUserPositions(userAddress) {
    const pool = await this.getPool();
    const ui = new Contract(
      UI_POOL_DATA_PROVIDER,
      [
        "function getUserReservesData(address, address) view returns (tuple(address underlyingAsset,uint256 scaledATokenBalance,uint256 usageAsCollateralEnabledOnUser,uint256 scaledVariableDebt,uint256 principalStableDebt,uint256 stableBorrowRate,uint256 stableBorrowLastUpdateTimestamp)[] userReservesData, uint8 userEmodeCategoryId)",
      ],
      this.provider,
    );

    const [userReserves, userEmodeCategoryId] = await ui.getUserReservesData(
      this.addressesProvider.target,
      userAddress,
    );

    const positions = parseUserPositions(userReserves);

    // 🔹 healthFactor берём из Pool
    const { healthFactor } = await pool.getUserAccountData(userAddress);
    console.log("positions: ", positions);
    return {
      positions,
      healthFactor: Number(healthFactor) / 1e18,
    };
  }
}

export async function parseUserPositions(userReserves) {
  // фильтруем реально существующие позиции и сразу возвращаем массив
  return userReserves
    .filter(
      (r) =>
        r.underlyingAsset !== "0x0000000000000000000000000000000000000000" &&
        (r.scaledATokenBalance > 0n ||
          r.principalStableDebt > 0n ||
          r.scaledVariableDebt > 0n),
    )
    .map((r) => ({
      assetAddress: r.underlyingAsset,
      aTokenBalance: r.scaledATokenBalance,
      stableDebt: r.principalStableDebt,
      variableDebt: r.scaledVariableDebt,
      collateral: r.usageAsCollateralEnabledOnUser,
      stableBorrowRate: r.stableBorrowRate,
      stableBorrowLastUpdateTimestamp: r.stableBorrowLastUpdateTimestamp,
    }));
}
