CREATE SCHEMA "photo_gallery";
--> statement-breakpoint
CREATE TABLE "photo_gallery"."galleries" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" text,
	"description" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "galleries_slug_unique" UNIQUE("slug"),
	CONSTRAINT "photo_gallery_galleries_status_check" CHECK ("photo_gallery"."galleries"."status" in ('draft', 'published'))
);
--> statement-breakpoint
CREATE TABLE "photo_gallery"."photos" (
	"id" text PRIMARY KEY NOT NULL,
	"gallery_id" text NOT NULL,
	"media_id" text NOT NULL,
	"caption" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "photo_gallery"."photos" ADD CONSTRAINT "photos_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "photo_gallery"."galleries"("id") ON DELETE cascade ON UPDATE no action;