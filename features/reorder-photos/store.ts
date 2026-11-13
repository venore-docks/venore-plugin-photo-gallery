import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries, photoGalleryPhotos } from "../../database/schema";

// Lê as fotos atuais com a galeria travada e só grava se a ordem pedida cobre exatamente elas
// (`accepts` vem do service — a regra não mora no store). Um UPDATE só, com CASE, em vez de um
// por foto.
export async function applyPhotoOrder(
  galleryId: string,
  photoIds: string[],
  accepts: (requested: readonly string[], current: readonly string[]) => boolean,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [gallery] = await tx
      .select({ id: photoGalleries.id })
      .from(photoGalleries)
      .where(eq(photoGalleries.id, galleryId))
      .for("update");
    if (!gallery) return false;

    const current = await tx
      .select({ id: photoGalleryPhotos.id })
      .from(photoGalleryPhotos)
      .where(eq(photoGalleryPhotos.galleryId, galleryId));
    if (!accepts(photoIds, current.map((row) => row.id))) return false;

    const cases = sql.join(
      photoIds.map((id, index) => sql`when ${id} then ${index}::int`),
      sql` `,
    );
    await tx
      .update(photoGalleryPhotos)
      .set({ order: sql`case ${photoGalleryPhotos.id} ${cases} end` })
      .where(eq(photoGalleryPhotos.galleryId, galleryId));

    await tx.update(photoGalleries).set({ updatedAt: sql`now()` }).where(eq(photoGalleries.id, galleryId));
    return true;
  });
}
