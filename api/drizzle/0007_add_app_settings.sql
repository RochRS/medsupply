CREATE TABLE "app_settings" (
	"id" integer PRIMARY KEY NOT NULL,
	"app_name" varchar(100) DEFAULT 'MedSupply' NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "must_change_password" boolean DEFAULT false NOT NULL;