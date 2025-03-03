import { z } from "zod";

// Habit validation schemas
export const habitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name cannot be empty")
    .max(100, "Habit name is too long"),
});

export const updateHabitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name cannot be empty")
    .max(100, "Habit name is too long")
    .optional(),
  completed: z.boolean().optional(),
});

// Habit type based on the schema
export type Habit = {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  lastCompleted: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// API response type
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
