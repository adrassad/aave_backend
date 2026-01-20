// blockchain/protocols/base.protocol.js
export class BaseProtocol {
  constructor({ provider, config }) {
    this.provider = provider;
    this.config = config;
  }

  async getAssets() {
    throw new Error('getAssets not implemented');
  }

  async getPrices() {
    throw new Error('getPrices not implemented');
  }

  async getUserPositions(userAddress) {
    throw new Error('getUserPositions not implemented');
  }
}
