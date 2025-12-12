import { Pool } from "pg";

console.log(process.env.DATABASE_URL)
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 30,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    maxLifetimeSeconds: 60
});


