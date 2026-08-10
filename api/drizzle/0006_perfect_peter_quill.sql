ALTER TABLE "categories" ADD COLUMN "icon" varchar(100) DEFAULT 'PackageIcon';--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN "status" varchar(32) DEFAULT 'open' NOT NULL;