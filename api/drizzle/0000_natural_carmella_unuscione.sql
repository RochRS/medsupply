CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "department" (
	"departmentId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "department_departmentId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"departmentName" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "role" (
	"roleId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "role_roleId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"roleName" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"categoryId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_categoryId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"categoryName" varchar(255) NOT NULL,
	"categoryDescription" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updateAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "items" (
	"itemId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "items_itemId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"itemName" varchar(255) NOT NULL,
	"description" text,
	"remainingAmount" integer NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp,
	"categoryId" integer
);
--> statement-breakpoint
CREATE TABLE "request" (
	"requestId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "request_requestId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"requestBatchId" integer NOT NULL,
	"requestedAmount" integer NOT NULL,
	"isUrgent" boolean NOT NULL,
	"isCompleted" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"itemId" integer,
	"userId" integer,
	"departmentId" integer,
	"requestDescriptionId" integer
);
--> statement-breakpoint
CREATE TABLE "request_description" (
	"requestDescriptionId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "request_description_requestDescriptionId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"requestDescriptionField" text
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"shipmentId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shipments_shipmentId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"shipmentBatchId" integer NOT NULL,
	"GTIN" integer DEFAULT 0,
	"experationDate" timestamp NOT NULL,
	"cost" integer NOT NULL,
	"deliveryDate" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"itemId" integer,
	"suppliersId" integer
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"supplierId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "suppliers_supplierId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"supplierName" varchar NOT NULL,
	"address" varchar,
	"description" text,
	"contactInfo" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");