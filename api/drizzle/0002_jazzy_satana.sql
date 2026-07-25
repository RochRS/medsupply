ALTER TABLE "department" RENAME COLUMN "departmentId" TO "department_id";--> statement-breakpoint
ALTER TABLE "department" RENAME COLUMN "departmentName" TO "department_name";--> statement-breakpoint
ALTER TABLE "department" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "department" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "role" RENAME COLUMN "roleId" TO "role_id";--> statement-breakpoint
ALTER TABLE "role" RENAME COLUMN "roleName" TO "role_name";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "categoryId" TO "category_id";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "categoryName" TO "category_name";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "categoryDescription" TO "category_description";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "updateAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "itemId" TO "item_id";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "itemName" TO "item_name";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "remainingAmount" TO "remaining_amount";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "categoryId" TO "category_id";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "requestId" TO "request_id";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "requestBatchId" TO "request_batch_id";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "requestedAmount" TO "requested_amount";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "isUrgent" TO "is_urgent";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "isCompleted" TO "is_completed";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "itemId" TO "item_id";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "departmentId" TO "department_id";--> statement-breakpoint
ALTER TABLE "request" RENAME COLUMN "requestDescriptionId" TO "request_description_id";--> statement-breakpoint
ALTER TABLE "request_description" RENAME COLUMN "requestDescriptionId" TO "request_description_id";--> statement-breakpoint
ALTER TABLE "request_description" RENAME COLUMN "requestDescriptionField" TO "request_description_field";--> statement-breakpoint
ALTER TABLE "shipments" RENAME COLUMN "shipmentId" TO "shipment_id";--> statement-breakpoint
ALTER TABLE "shipments" RENAME COLUMN "shipmentBatchId" TO "shipment_batch_id";--> statement-breakpoint
ALTER TABLE "shipments" RENAME COLUMN "GTIN" TO "gtin";--> statement-breakpoint
ALTER TABLE "shipments" RENAME COLUMN "experationDate" TO "expiration_date";--> statement-breakpoint
ALTER TABLE "shipments" RENAME COLUMN "deliveryDate" TO "delivery_date";--> statement-breakpoint
ALTER TABLE "shipments" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "shipments" RENAME COLUMN "itemId" TO "item_id";--> statement-breakpoint
ALTER TABLE "shipments" RENAME COLUMN "suppliersId" TO "supplier_id";--> statement-breakpoint
ALTER TABLE "suppliers" RENAME COLUMN "supplierId" TO "supplier_id";--> statement-breakpoint
ALTER TABLE "suppliers" RENAME COLUMN "supplierName" TO "supplier_name";--> statement-breakpoint
ALTER TABLE "suppliers" RENAME COLUMN "contactInfo" TO "contact_info";--> statement-breakpoint
ALTER TABLE "suppliers" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "suppliers" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_categoryId_categories_categoryId_fk";
--> statement-breakpoint
ALTER TABLE "request" DROP CONSTRAINT "request_itemId_items_itemId_fk";
--> statement-breakpoint
ALTER TABLE "request" DROP CONSTRAINT "request_requestDescriptionId_request_description_requestDescriptionId_fk";
--> statement-breakpoint
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_itemId_items_itemId_fk";
--> statement-breakpoint
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_suppliersId_suppliers_supplierId_fk";
--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_request_description_id_request_description_request_description_id_fk" FOREIGN KEY ("request_description_id") REFERENCES "public"."request_description"("request_description_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_supplier_id_suppliers_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("supplier_id") ON DELETE no action ON UPDATE no action;