CREATE TABLE "web_account" (
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
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "web_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "web_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "web_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"username" text,
	"display_username" text,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "web_user_email_unique" UNIQUE("email"),
	CONSTRAINT "web_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "web_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "web_account" ADD CONSTRAINT "web_account_user_id_web_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."web_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_session" ADD CONSTRAINT "web_session_user_id_web_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."web_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "web_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "web_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "web_session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "web_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "web_verification" USING btree ("identifier");