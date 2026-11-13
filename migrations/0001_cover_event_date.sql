ALTER TABLE "photo_gallery"."galleries" ADD COLUMN "event_date" date;--> statement-breakpoint
ALTER TABLE "photo_gallery"."galleries" ADD COLUMN "cover_photo_id" text;--> statement-breakpoint
CREATE INDEX "photo_gallery_photos_gallery_order_idx" ON "photo_gallery"."photos" USING btree ("gallery_id","order");