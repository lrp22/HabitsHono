import { app } from "@/src/api/index.js";
import { serve } from "@hono/node-server";
import * as dotenv from "dotenv";
import { logger } from "hono/logger";

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging
dotenv.config();
// Add logger middleware to all routes
app.use("*", logger());

// Start the server
const PORT = process.env.PORT || 3000;

serve(
  {
    fetch: app.fetch,
    port: Number(PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
