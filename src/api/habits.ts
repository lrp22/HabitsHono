import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/src/db/index.js";
import { habits } from "@/src/db/schema.js";
import { eq } from "drizzle-orm";
import { habitSchema, updateHabitSchema } from "@/src/types.js";

// Create a Hono app for habit routes
const habitRoutes = new Hono();

// GET all habits
habitRoutes.get("/", async (c) => {
  try {
    const allHabits = await db.select().from(habits).orderBy(habits.createdAt);
    
    return c.json({
      success: true,
      data: allHabits
    });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch habits"
      },
      500
    );
  }
});

// GET a single habit by ID
habitRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    
    if (!habit) {
      return c.json(
        {
          success: false,
          error: "Habit not found"
        },
        404
      );
    }
    
    return c.json({
      success: true,
      data: habit
    });
  } catch (error) {
    console.error(`Error fetching habit ${c.req.param("id")}:`, error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch habit"
      },
      500
    );
  }
});

// POST create a new habit
habitRoutes.post("/", zValidator("json", habitSchema), async (c) => {
  try {
    const { name } = c.req.valid("json");
    
    const [newHabit] = await db
      .insert(habits)
      .values({
        name,
        // Other fields will use default values
      })
      .returning();
    
    return c.json(
      {
        success: true,
        data: newHabit
      },
      201
    );
  } catch (error) {
    console.error("Error creating habit:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create habit"
      },
      500
    );
  }
});

// PATCH update a habit
habitRoutes.patch("/:id", zValidator("json", updateHabitSchema), async (c) => {
  try {
    const id = c.req.param("id");
    const updates = c.req.valid("json");
    
    // First check if the habit exists
    const [existingHabit] = await db.select().from(habits).where(eq(habits.id, id));
    
    if (!existingHabit) {
      return c.json(
        {
          success: false,
          error: "Habit not found"
        },
        404
      );
    }
    
    // Prepare the updates
    const updateData: any = {
      ...updates,
      updatedAt: new Date()
    };
    
    // If toggling completion, handle streak logic
    if (updates.completed !== undefined) {
      updateData.streak = updates.completed 
        ? existingHabit.streak + 1 
        : Math.max(0, existingHabit.streak - 1);
      
      updateData.lastCompleted = updates.completed 
        ? new Date() 
        : existingHabit.lastCompleted;
    }
    
    // Update the habit
    const [updatedHabit] = await db
      .update(habits)
      .set(updateData)
      .where(eq(habits.id, id))
      .returning();
    
    return c.json({
      success: true,
      data: updatedHabit
    });
  } catch (error) {
    console.error(`Error updating habit ${c.req.param("id")}:`, error);
    return c.json(
      {
        success: false,
        error: "Failed to update habit"
      },
      500
    );
  }
});

// DELETE a habit
habitRoutes.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    // Check if the habit exists
    const [existingHabit] = await db.select().from(habits).where(eq(habits.id, id));
    
    if (!existingHabit) {
      return c.json(
        {
          success: false,
          error: "Habit not found"
        },
        404
      );
    }
    
    // Delete the habit
    await db.delete(habits).where(eq(habits.id, id));
    
    return c.json({
      success: true,
      message: "Habit deleted successfully"
    });
  } catch (error) {
    console.error(`Error deleting habit ${c.req.param("id")}:`, error);
    return c.json(
      {
        success: false,
        error: "Failed to delete habit"
      },
      500
    );
  }
});

export default habitRoutes;