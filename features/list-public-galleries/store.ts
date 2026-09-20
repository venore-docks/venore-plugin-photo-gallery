import { asc, desc, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries, photoGalleryPhotos } from "../../database/schema";
import type { GalleryRecord, GalleryPhotoRecord } from "../../contracts/types";

export async function findPublishedGalleries(): Promise<GalleryRecord[]> {
  const rows = await db
    .select()
    .from(photoGalleries)
    .where(eq(photoGalleries.status, "published"))
    .orderBy(desc(photoGalleries.publishedAt));
  return rows as GalleryRecord[];
}

// Primeira foto (menor `order`) de cada galeria — usada como capa na listagem pública. Uma
// query por galeria é aceitável no volume esperado deste plugin (dezenas de galerias, não
// milhares); otimizar com uma única query agregada fica pra quando/se isso virar gargalo real.
export async function findFirstPhotoByGalleryId(galleryId: string): Promise<GalleryPhotoRecord | null> {
  const [row] = await db
    .select()
    .from(photoGalleryPhotos)
    .where(eq(photoGalleryPhotos.galleryId, galleryId))
    .orderBy(asc(photoGalleryPhotos.order))
    .limit(1);
  return (row as GalleryPhotoRecord) ?? null;
}
