import { Pool } from "pg";

// Create a connection pool for better performance
const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper function to execute queries with automatic error handling
export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Helper function to execute a query and return rows
export async function queryRows(text, params) {
  const result = await query(text, params);
  return result.rows;
}

// Helper function to execute a query and return a single row
export async function queryOne(text, params) {
  const result = await query(text, params);
  return result.rows[0];
}

// Export the pool for advanced use cases
export default pool;
