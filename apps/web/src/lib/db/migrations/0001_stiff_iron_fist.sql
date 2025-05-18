CREATE TYPE "public"."practice_test_type_enum" AS ENUM('math', 'verbal', 'full');--> statement-breakpoint
CREATE TYPE "public"."question_type_enum" AS ENUM('multiple_choice', 'grid_in');--> statement-breakpoint
CREATE TYPE "public"."section_type_enum" AS ENUM('math', 'verbal');--> statement-breakpoint
CREATE TYPE "public"."test_attempt_status_enum" AS ENUM('pending', 'active', 'paused', 'completed');--> statement-breakpoint
CREATE TABLE "web_module" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid,
	"title" text NOT NULL,
	"duration" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "web_practice_test" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"type" "practice_test_type_enum" NOT NULL,
	"user_id" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "web_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid,
	"question_text" text NOT NULL,
	"passage_text" text,
	"options" jsonb,
	"correct_answer" text NOT NULL,
	"explanation" text,
	"domain" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "web_section" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_test_id" uuid,
	"type" "section_type_enum" NOT NULL,
	"duration" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "web_test_attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"practice_test_id" uuid,
	"status" "test_attempt_status_enum" DEFAULT 'pending' NOT NULL,
	"results" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "web_module" ADD CONSTRAINT "web_module_section_id_web_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."web_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_practice_test" ADD CONSTRAINT "web_practice_test_user_id_web_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."web_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_question" ADD CONSTRAINT "web_question_module_id_web_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."web_module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_section" ADD CONSTRAINT "web_section_practice_test_id_web_practice_test_id_fk" FOREIGN KEY ("practice_test_id") REFERENCES "public"."web_practice_test"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_test_attempt" ADD CONSTRAINT "web_test_attempt_user_id_web_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."web_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_test_attempt" ADD CONSTRAINT "web_test_attempt_practice_test_id_web_practice_test_id_fk" FOREIGN KEY ("practice_test_id") REFERENCES "public"."web_practice_test"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "module_section_id_idx" ON "web_module" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "practice_test_type_idx" ON "web_practice_test" USING btree ("type");--> statement-breakpoint
CREATE INDEX "section_practice_test_id_idx" ON "web_section" USING btree ("practice_test_id");