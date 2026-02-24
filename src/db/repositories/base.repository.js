export class BaseRepository {
  constructor(db, tableName, idColumn) {
    this.db = db;
    this.tableName = tableName;
    this.idColumn = idColumn;
  }

  async findById(id) {
    const res = await this.db.query(
      `SELECT * FROM ${this.tableName} WHERE ${this.idColumn} = $1`,
      [id],
    );

    return res.rows[0] || null;
  }

  async count(id) {
    const res = await this.db.query(
      `SELECT COUNT(*)::int AS count FROM ${this.tableName} WHERE ${this.idColumn} = $1`,
      [id],
    );
    return res.rows[0].count;
  }

  async findAll() {
    const res = await this.db.query(`SELECT * FROM ${this.tableName}`);

    return res.rows;
  }

  async delete(id) {
    await this.db.query(
      `DELETE FROM ${this.tableName} WHERE ${this.idColumn} = $1`,
      [id],
    );
  }

  async update(id, fields, allowedFields = null) {
    const keys = Object.keys(fields);
    if (!keys.length) return null;

    const safeKeys = allowedFields
      ? keys.filter((k) => allowedFields.includes(k))
      : keys;

    if (!safeKeys.length) return null;

    const setClause = safeKeys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const values = [id, ...safeKeys.map((k) => fields[k])];

    const res = await this.db.query(
      `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE ${this.idColumn} = $1
      RETURNING *
      `,
      values,
    );

    return res.rows[0] || null;
  }
}
