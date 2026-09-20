import { desc, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleryPhotos } from "../../database/schema";
import type { GalleryPhotoRecord } from "../../contracts/types";

export async function findMaxPhotoOrder(galleryId: string): Promise<number> {
  const [row] = await db
    .select({ order: photoGalleryPhotos.order })
    .from(photoGalleryPhotos)
    .where(eq(photoGalleryPhotos.galleryId, galleryId))
    .orderBy(desc(photoGalleryPhotos.order))
    .limit(1);
  return row?.order ?? -1;
}

export async function insertPhoto(input: { galleryId: string; mediaId: string; order: number }): Promise<GalleryPhotoRecord> {
  const [row] = await db
    .insert(photoGalleryPhotos)
    .values({ galleryId: input.galleryId, mediaId: input.mediaId, order: input.order })
    .returning();
  return row as GalleryPhotoRecord;
}
