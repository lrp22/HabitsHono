import habitRoutes from "@/src/api/habits.js";
import { Hono } from "hono";

// Create the main Hono app
export const app = new Hono();

// Health check endpoint
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Habit Tracker API is running",
    version: "1.0.0",
  });
});

// Mount the habit routes
app.route("/api/habits", habitRoutes);

// Handle 404 - Route not found
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Route not found",
    },
    404
  );
});
