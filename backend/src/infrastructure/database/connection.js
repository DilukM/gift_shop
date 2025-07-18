import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Database configuration
const dbConfig = {
  connectionString: process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Pool error handling
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Database connection function
export const connectDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log("🔗 Connected to PostgreSQL database");

    // Test the connection
    const result = await client.query("SELECT NOW()");
    console.log("📅 Database time:", result.rows[0].now);

    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
};

// Query function
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === "development") {
      console.log("📊 Query executed:", {
        text: text.substring(0, 100) + "...",
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }

    return result;
  } catch (error) {
    console.error("❌ Query error:", error.message);
    console.error("📝 Query:", text);
    console.error("🔢 Params:", params);
    throw error;
  }
};

// Transaction function
export const transaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Get a client from the pool (for advanced use cases)
export const getClient = async () => {
  return await pool.connect();
};

// Close the pool (for graceful shutdown)
export const closePool = async () => {
  await pool.end();
  console.log("🔒 Database pool closed");
};

// Health check function
export const healthCheck = async () => {
  try {
    const result = await query("SELECT 1 as health_check");
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      latency: "low",
    };
  } catch (error) {
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
};

export default pool;
export { pool };
