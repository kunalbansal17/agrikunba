import pg from "pg";

export const pgpool = new pg.Pool({
  connectionString: process.env.INTENTSEARCH_DATABASE_URL!,
  ssl: {
    require: true,
    rejectUnauthorized: false, // accept Supabase cert
  },
});
