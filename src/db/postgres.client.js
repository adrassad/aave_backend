//src/db/postgres.client.js
import pkg from 'pg';
import { ENV } from '../config/env.js';
import { DbClient } from './db.client.js';

const { Pool } = pkg;

export class PostgresClient extends DbClient {
  constructor() {
    super();
    this.pool = new Pool({
      connectionString: ENV.DATABASE_URL
    });
  }

  async query(text, params) {
    return this.pool.query(text, params);
  }
}