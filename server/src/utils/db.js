import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

function poolConfigFromEnv() {
  // Preferred: MYSQL_* vars for local dev
  const host = process.env.MYSQL_HOST || 'localhost';
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'flipkart_clone';

  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true
  };
}

// Supports either DATABASE_URL (for cloud MySQL) OR MYSQL_* vars
// Example DATABASE_URL: mysql://user:pass@host:3306/dbname
function poolFromDatabaseUrl(databaseUrl) {
  // DATABASE_URL example: mysql://user:pass@host:3306/dbname
  const url = new URL(databaseUrl);
  return mysql.createPool({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username || 'root'),
    password: decodeURIComponent(url.password || ''),
    database: url.pathname.replace(/^\//, ''),
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true
  });
}

const pool = process.env.DATABASE_URL
  ? poolFromDatabaseUrl(process.env.DATABASE_URL)
  : mysql.createPool(poolConfigFromEnv());

/**
 * query(sql, params)
 * - Returns { rows } to keep the route code simple
 */
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return { rows };
}

/**
 * getClient()
 * - Used for transactions (orders, seeding)
 */
export async function getClient() {
  const conn = await pool.getConnection();

  return {
    async query(sql, params = []) {
      // For multi statements without params, use conn.query
      if (!params || params.length === 0) {
        const [rows] = await conn.query(sql);
        return { rows };
      }
      const [rows] = await conn.execute(sql, params);
      return { rows };
    },
    async begin() {
      await conn.beginTransaction();
    },
    async commit() {
      await conn.commit();
    },
    async rollback() {
      await conn.rollback();
    },
    release() {
      conn.release();
    }
  };
}

export default pool;
