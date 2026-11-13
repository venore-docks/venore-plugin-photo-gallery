import { and, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleryPhotos } from "../../database/schema";
import type { GalleryPhotoRecord } from "../../contracts/types";

export async function setPhotoCaption(galleryId: string, photoId: string, caption: string | null): Promise<GalleryPhotoRecord | null> {
  const [row] = await db
    .update(photoGalleryPhotos)
    .set({ caption })
    .where(and(eq(photoGalleryPhotos.id, photoId), eq(photoGalleryPhotos.galleryId, galleryId)))
    .returning();
  return (row as GalleryPhotoRecord) ?? null;
}
