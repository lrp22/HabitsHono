import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

// Define habits table schema
export const habits = pgTable("habits", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  completed: boolean("completed").default(false).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastCompleted: timestamp("last_completed", { mode: "date" }),
  userId: text("user_id").notNull().default("anonymous"), // For when you add authentication
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// You can define relationships and additional tables here
