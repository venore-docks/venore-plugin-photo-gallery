import { eq, inArray, and, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries, photoGalleryPhotos } from "../../database/schema";
import type { GalleryPhotoRecord } from "../../contracts/types";

// Tudo numa transação com a linha da galeria travada (FOR UPDATE): dois envios simultâneos na
// mesma galeria não calculam o mesmo "próximo order", e galeria apagada no meio vira null em vez
// de erro de FK. Asset que já está na galeria é pulado (sem duplicar).
export async function appendPhotosToGallery(
  galleryId: string,
  mediaIds: string[],
): Promise<{ inserted: GalleryPhotoRecord[]; alreadyInGallery: number } | null> {
  return db.transaction(async (tx) => {
    const [gallery] = await tx
      .select({ id: photoGalleries.id })
      .from(photoGalleries)
      .where(eq(photoGalleries.id, galleryId))
      .for("update");
    if (!gallery) return null;

    const existing = await tx
      .select({ mediaId: photoGalleryPhotos.mediaId })
      .from(photoGalleryPhotos)
      .where(and(eq(photoGalleryPhotos.galleryId, galleryId), inArray(photoGalleryPhotos.mediaId, mediaIds)));
    const existingIds = new Set(existing.map((row) => row.mediaId));
    const fresh = mediaIds.filter((id) => !existingIds.has(id));
    if (fresh.length === 0) {
      return { inserted: [], alreadyInGallery: mediaIds.length };
    }

    const [{ maxOrder }] = await tx
      .select({ maxOrder: sql<number>`coalesce(max(${photoGalleryPhotos.order}), -1)`.mapWith(Number) })
      .from(photoGalleryPhotos)
      .where(eq(photoGalleryPhotos.galleryId, galleryId));

    const inserted = await tx
      .insert(photoGalleryPhotos)
      .values(fresh.map((mediaId, index) => ({ galleryId, mediaId, order: maxOrder + 1 + index })))
      .returning();

    await tx.update(photoGalleries).set({ updatedAt: sql`now()` }).where(eq(photoGalleries.id, galleryId));

    return { inserted: inserted as GalleryPhotoRecord[], alreadyInGallery: mediaIds.length - fresh.length };
  });
}
