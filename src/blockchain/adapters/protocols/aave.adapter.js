//src/blockchain/adapters/protocols/aave.adapter.js
import { Contract } from "ethers";
import { BaseProtocol } from "../../protocols/base.protocol.js"; 
import { ADDRESSES_PROVIDER_ABI, AAVE_POOL_ABI, ERC20_ABI} from "../../protocols/aave/abi/aave.abis.js";

export class AaveAdapter extends BaseProtocol{
  constructor({provider, config}){
    super({provider, config});

    if (!config.ADDRESSES_PROVIDER) {
      throw new Error('Aave ADDRESSES_PROVIDER not configured');
    }

    this.addressesProvider = new Contract(
      config.ADDRESSES_PROVIDER,
      ADDRESSES_PROVIDER_ABI,
      provider
    );
  }

  async getPool(){
    if (!this.pool) {
      const poolAddress = await this.addressesProvider.getPool();
      this.pool = new Contract(poolAddress, AAVE_POOL_ABI, this.provider)
    }
    return this.pool;
  }

  async getAssets(){
    const pool = await this.getPool();
    const reserves = await pool.getReservesList();
    const result = await Promise.all(
    reserves.map(async (address) => {
      const token = new Contract(address, ERC20_ABI, this.provider);
      const [symbol, decimals] = await Promise.all([token.symbol(), token.decimals()]);
      return { address, symbol, decimals: Number(decimals) };
    })
  );

  return result;
  }

  async getUserPositions(userAddress){
    const pool = await this.getPool();
    return pool.getUserPositions(userAddress);
  }
}