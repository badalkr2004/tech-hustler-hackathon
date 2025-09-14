CREATE TABLE "availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL,
	"is_recurring" boolean DEFAULT true,
	"specific_date" timestamp,
	"max_bookings" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"icon" varchar(100),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"session_id" uuid,
	"content" text NOT NULL,
	"message_type" varchar(20) DEFAULT 'text',
	"attachments" jsonb,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"is_edited" boolean DEFAULT false,
	"edited_at" timestamp,
	"reply_to_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"action_url" varchar(500),
	"metadata" jsonb,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"payer_id" uuid NOT NULL,
	"payee_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"platform_fee" numeric(10, 2) DEFAULT '0.00',
	"net_amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_intent_id" varchar(255),
	"stripe_charge_id" varchar(255),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"failure_reason" text,
	"processed_at" timestamp,
	"refunded_at" timestamp,
	"refund_amount" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"reviewee_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(200),
	"comment" text,
	"aspect_ratings" jsonb,
	"would_recommend" boolean,
	"is_public" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"teacher_response" text,
	"teacher_response_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"scheduled_start_time" timestamp NOT NULL,
	"scheduled_end_time" timestamp NOT NULL,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"cancellation_reason" text,
	"price_per_hour" numeric(8, 2) NOT NULL,
	"total_amount" numeric(8, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"payment_status" varchar(20) DEFAULT 'pending',
	"payment_intent_id" varchar(255),
	"session_notes" text,
	"student_notes" text,
	"teacher_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" integer NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"short_description" varchar(500),
	"skill_level" varchar(50) NOT NULL,
	"duration" integer NOT NULL,
	"max_students" integer DEFAULT 1,
	"price_per_hour" numeric(8, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"prerequisites" jsonb,
	"what_you_learn" jsonb,
	"materials" jsonb,
	"tags" jsonb,
	"thumbnail_image" varchar(500),
	"gallery" jsonb,
	"is_active" boolean DEFAULT true,
	"average_rating" numeric(3, 2) DEFAULT '0.00',
	"total_sessions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teacher_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"experience" text,
	"education" jsonb,
	"certifications" jsonb,
	"languages" jsonb,
	"achievements" jsonb,
	"social_links" jsonb,
	"hourly_rate" numeric(8, 2),
	"response_time" integer DEFAULT 24,
	"completed_sessions" integer DEFAULT 0,
	"total_students" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "teacher_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"bio" text,
	"profile_image" varchar(500),
	"location" varchar(200),
	"timezone" varchar(50) DEFAULT 'UTC',
	"phone_number" varchar(20),
	"date_of_birth" timestamp,
	"average_rating" numeric(3, 2) DEFAULT '0.00',
	"total_reviews" integer DEFAULT 0,
	"total_earnings" numeric(10, 2) DEFAULT '0.00',
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_seen" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "call_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_call_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(20) NOT NULL,
	"joined_at" timestamp,
	"left_at" timestamp,
	"connection_id" varchar(255),
	"device_info" jsonb,
	"quality_metrics" jsonb
);
--> statement-breakpoint
CREATE TABLE "video_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"provider" varchar(20) DEFAULT 'mux' NOT NULL,
	"room_id" varchar(255) NOT NULL,
	"room_url" varchar(500),
	"stream_key" varchar(255),
	"playback_id" varchar(255),
	"recording_enabled" boolean DEFAULT false,
	"recording_url" varchar(500),
	"recording_status" varchar(20) DEFAULT 'disabled',
	"max_duration" integer DEFAULT 7200,
	"actual_duration" integer,
	"connection_quality" jsonb,
	"call_started_at" timestamp,
	"call_ended_at" timestamp,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "video_calls_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_id_messages_id_fk" FOREIGN KEY ("reply_to_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payer_id_users_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payee_id_users_id_fk" FOREIGN KEY ("payee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewee_id_users_id_fk" FOREIGN KEY ("reviewee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_materials" ADD CONSTRAINT "session_materials_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_materials" ADD CONSTRAINT "session_materials_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_participants" ADD CONSTRAINT "call_participants_video_call_id_video_calls_id_fk" FOREIGN KEY ("video_call_id") REFERENCES "public"."video_calls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_participants" ADD CONSTRAINT "call_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_calls" ADD CONSTRAINT "video_calls_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "skill_availability_idx" ON "availability" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "teacher_availability_idx" ON "availability" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "day_availability_idx" ON "availability" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "message_conversation_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_sender_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_receiver_idx" ON "messages" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "message_session_idx" ON "messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "message_created_idx" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "message_reply_to_idx" ON "messages" USING btree ("reply_to_id");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notification_created_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payment_session_idx" ON "payment_transactions" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "payment_payer_idx" ON "payment_transactions" USING btree ("payer_id");--> statement-breakpoint
CREATE INDEX "payment_payee_idx" ON "payment_transactions" USING btree ("payee_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payment_transactions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "review_session_idx" ON "reviews" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "review_skill_idx" ON "reviews" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "review_reviewee_idx" ON "reviews" USING btree ("reviewee_id");--> statement-breakpoint
CREATE INDEX "review_rating_idx" ON "reviews" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "session_skill_idx" ON "sessions" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "session_teacher_idx" ON "sessions" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "session_student_idx" ON "sessions" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "session_status_idx" ON "sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "scheduled_time_idx" ON "sessions" USING btree ("scheduled_start_time");--> statement-breakpoint
CREATE INDEX "material_session_idx" ON "session_materials" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "material_uploader_idx" ON "session_materials" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "teacher_idx" ON "skills" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "category_idx" ON "skills" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "skill_level_idx" ON "skills" USING btree ("skill_level");--> statement-breakpoint
CREATE INDEX "price_idx" ON "skills" USING btree ("price_per_hour");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "location_idx" ON "users" USING btree ("location");--> statement-breakpoint
CREATE INDEX "participant_call_idx" ON "call_participants" USING btree ("video_call_id");--> statement-breakpoint
CREATE INDEX "participant_user_idx" ON "call_participants" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "video_call_session_idx" ON "video_calls" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "video_call_room_idx" ON "video_calls" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "video_call_provider_idx" ON "video_calls" USING btree ("provider");