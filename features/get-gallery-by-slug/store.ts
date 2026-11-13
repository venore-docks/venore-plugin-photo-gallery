import { and, asc, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries, photoGalleryPhotos } from "../../database/schema";
import type { GalleryPhotoRecord, GalleryRecord } from "../../contracts/types";

export async function findPublishedGalleryBySlug(slug: string): Promise<GalleryRecord | null> {
  const [row] = await db
    .select()
    .from(photoGalleries)
    .where(and(eq(photoGalleries.slug, slug), eq(photoGalleries.status, "published")))
    .limit(1);
  return (row as GalleryRecord) ?? null;
}

export async function findPhotosByGalleryId(galleryId: string): Promise<GalleryPhotoRecord[]> {
  const rows = await db
    .select()
    .from(photoGalleryPhotos)
    .where(eq(photoGalleryPhotos.galleryId, galleryId))
    .orderBy(asc(photoGalleryPhotos.order), asc(photoGalleryPhotos.createdAt));
  return rows as GalleryPhotoRecord[];
}
