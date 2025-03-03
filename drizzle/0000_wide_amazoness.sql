CREATE TABLE "habits" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"last_completed" timestamp,
	"user_id" text DEFAULT 'anonymous' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
