import { BaseRepository } from "./base.repository.js";

export class HFRepository extends BaseRepository {
  constructor(db) {
    super(db, "healthfactors", "id");
  }
  async create(data) {
    const normalizedHF =
      data.healthfactor === Infinity
        ? Infinity
        : Number(data.healthfactor.toFixed(2));
    const { rowCount } = await this.db.query(
      `
        INSERT INTO healthfactors (wallet_id, protocol, network_id, healthfactor)
        SELECT $1, $2, $3, $4
        WHERE NOT EXISTS (
          SELECT 1 FROM (
            SELECT healthfactor
            FROM healthfactors
            WHERE wallet_id = $1
              AND protocol = $2
              AND network_id = $3
            ORDER BY timestamp DESC
            LIMIT 1
          ) last
          WHERE last.healthfactor IS NOT DISTINCT FROM $4
        )
        RETURNING id;
        `,
      [data.wallet_id, data.protocol, data.network_id, normalizedHF],
    );
    return rowCount > 0;
  }
}
