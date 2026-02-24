import { BaseRepository } from "./base.repository.js";

// src/db/repositories/price.repo.js
export class PriceRepository extends BaseRepository {
  constructor(db) {
    super(db, "prices", "id");
  }

  async create(object) {
    await this.db.query(
      `
        INSERT INTO prices (network_id, asset_id, price_usd, timestamp)
        VALUES ($1, $2, $3, NOW())
        `,
      [object.network_id, object.asset_id, object.priceUsd],
    );
  }

  async getLastPricesByNetwork(network_id) {
    const res = await this.db.query(
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
  }
}
