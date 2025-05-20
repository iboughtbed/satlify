ALTER TABLE "web_module" ALTER COLUMN "section_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "web_practice_test" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "web_question" ALTER COLUMN "module_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "web_section" ALTER COLUMN "practice_test_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "web_test_attempt" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "web_test_attempt" ALTER COLUMN "practice_test_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "web_question" ADD COLUMN "type" "question_type_enum" NOT NULL;