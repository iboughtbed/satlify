CREATE TYPE "public"."module_order_enum" AS ENUM('1', '2');--> statement-breakpoint
ALTER TABLE "web_module" ADD COLUMN "order" "module_order_enum" NOT NULL;