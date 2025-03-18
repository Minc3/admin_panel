import mariadb from 'mariadb';

const config = useRuntimeConfig();

const pool = mariadb.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  port: Number(config.DB_PORT),
  connectionLimit: 5,
});

export async function executeQuery<T>(
  query: string,
  params?: any[]
): Promise<T> {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(query, params);
    return result;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}
