import pg from "pg";

// ✅ Force SSL but ignore self-signed cert
export const pgpool = new pg.Pool({
  connectionString: process.env.INTENTSEARCH_DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Optional: test connection immediately
pgpool.connect()
  .then(client => {
    console.log("✅ DB connected");
    client.release();
  })
  .catch(err => {
    console.error("❌ DB connection error:", err.message);
  });
