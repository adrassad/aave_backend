// src/db/repositories/price.repo.js

export function createPriceRepository(db) {
  return {
    async getLastPriceByAssetAddress(address) {
      const res = await db.query(
        `
        SELECT p.price_usd
        FROM prices p
        JOIN assets a ON p.asset_id = a.id
        WHERE a.address = $1
        ORDER BY p.timestamp DESC
        LIMIT 1
        `,
        [address.toLowerCase()],
      );

      return res.rows;
    },

    async getLastPriceByNetwork(network_id) {
      const res = await db.query(
        `
        SELECT DISTINCT ON (p.asset_id)
          p.asset_id,
          a.symbol,
          a.address,
          p.price_usd,
          p.timestamp
        FROM prices p
          INNER JOIN assets a ON a.id = p.asset_id
        WHERE p.network_id = $1
          ORDER BY p.asset_id, p.timestamp DESC;
        `,
        [network_id],
      );

      return res.rows;
    },

    async savePrice(network_id, asset_id, priceUsd) {
      await db.query(
        `
        INSERT INTO prices (network_id, asset_id, price_usd, timestamp)
        VALUES ($1, $2, $3, NOW())
        `,
        [network_id, asset_id, priceUsd],
      );
    },
  };
}
