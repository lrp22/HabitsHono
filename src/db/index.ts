import * as schema from "@/src/db/schema.js";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

// Create a connection to the Neon database
const sql = neon(process.env.DATABASE_URL);

// Create a Drizzle ORM instance with our schema
export const db = drizzle(sql, { schema });
