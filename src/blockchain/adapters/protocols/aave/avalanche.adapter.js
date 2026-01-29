//ssrc/blockchain/adapters/protocols/aave/avalanche.adapter.js
import { Contract, getAddress } from "ethers";
import { AaveBaseAdapter } from "../base.protocol.js";
import {
  AAVE_POOL_ABI,
  AAVE_ORACLE_ABI,
  AAVE_DATA_PROVIDER_ABI,
} from "../../../protocols/aave/abi/aave.abis.js";
import { getTokenMetadata } from "../../../helpers/tokenMetadata.js";
import { isAddress } from "ethers";

const STATIC = {
  POOL: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  ORACLE: "0xEBd36016B3eD09D4693Ed4251c67Bd858c3c7C9C",
  DATA_PROVIDER: "0x65285E9dfab318f57051ab2b139ccCf232945451",
};

export class AaveAvalancheAdapter extends AaveBaseAdapter {
  constructor({ provider, config }) {
    super({ provider, config });

    this.pool = new Contract(STATIC.POOL, AAVE_POOL_ABI, provider);

    this.oracle = new Contract(STATIC.ORACLE, AAVE_ORACLE_ABI, provider);

    this.dataProvider = new Contract(
      STATIC.DATA_PROVIDER,
      AAVE_DATA_PROVIDER_ABI,
      provider,
    );
  }

  async getAssets() {
    const reserves = await this.pool.getReservesList();

    const assets = await Promise.all(
      reserves.map((address) =>
        getTokenMetadata(address, this.provider).catch(() => null),
      ),
    );

    return assets.filter(Boolean);
  }

  async getPrices(assets) {
    const ORACLE_DECIMALS = 8;
    const prices = {};

    await Promise.all(
      assets.map(async ({ address, symbol }) => {
        if (!isAddress(address)) return;

        try {
          const rawPrice = await this.oracle.getAssetPrice(address);
          if (!rawPrice || rawPrice === 0n) return;

          prices[address.toLowerCase()] = {
            address,
            symbol,
            price: Number(rawPrice) / 10 ** ORACLE_DECIMALS,
          };
        } catch {}
      }),
    );

    return prices;
  }

  async getUserPositions(userAddress) {
    const reserves = await this.pool.getReservesList();
    const positions = [];

    await Promise.all(
      reserves.map(async (asset) => {
        try {
          const data = await this.dataProvider.getUserReserveData(
            asset,
            userAddress,
          );

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

          if (
            aTokenBalance === 0n &&
            stableDebt === 0n &&
            variableDebt === 0n
          ) {
            return;
          }

          positions.push({
            assetAddress: asset,
            aTokenBalance,
            stableDebt,
            variableDebt,
            collateral,
          });
        } catch {}
      }),
    );

    const { healthFactor } = await this.pool.getUserAccountData(userAddress);

    return {
      positions,
      healthFactor: Number(healthFactor) / 1e18,
    };
  }
}
