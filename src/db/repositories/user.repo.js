import { BaseRepository } from "./base.repository.js";

export class UserRepository extends BaseRepository {
  constructor(db) {
    super(db, "users", "telegram_id");
  }

  async create(user) {
    const result = await this.db.query(
      `
      INSERT INTO users (
        telegram_id,
        name,
        first_name,
        last_name,
        subscription_level,
        subscription_end
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        'free',
        NOW() + INTERVAL '30 days'
      )
      ON CONFLICT (telegram_id) DO NOTHING
      RETURNING *
      `,
      [user.id, user.username, user.first_name, user.last_name],
    );
    return result.rows[0] || null;
  }

  async updateUser(id, fields) {
    const allowedFields = [
      "subscription_level",
      "subscription_end",
      "threshold_hf",
    ];
    return super.update(id, fields, allowedFields);
  }

  async getAllPro() {
    const res = await this.db.query(
      `SELECT *
       FROM users
       WHERE subscription_level ='pro'
       `,
    );

    return res.rows;
  }
}
