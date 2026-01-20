//src/db/repositories/network.repo.js

// src/db/repositories/network.repo.js

export function createNetworkRepository(db) {
  return {
    async getEnabled() {
      const res = await db.query(
        `SELECT * FROM networks WHERE enabled = true`
      );
      return res.rows;
    },

    async create(network) {
      await db.query(
        `
        INSERT INTO networks (name, chain_id, native_symbol, enabled)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        `,
        [network.name, network.chain_id, network.native_symbol, network.enabled]
      );
    }
  };
}