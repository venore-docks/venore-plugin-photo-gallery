import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries, photoGalleryPhotos } from "../../database/schema";

// Só remove o vínculo galeria <-> asset (escopado à galeria: id de foto de OUTRA galeria não é
// apagado). O asset continua no MMS — o ciclo de vida dele é do core (/admin/media, lixeira),
// não do plugin. Capa apagada volta a ser "primeira foto" na mesma transação.
export async function deletePhotosFromGallery(galleryId: string, photoIds: string[]): Promise<number> {
  return db.transaction(async (tx) => {
    const deleted = await tx
      .delete(photoGalleryPhotos)
      .where(and(eq(photoGalleryPhotos.galleryId, galleryId), inArray(photoGalleryPhotos.id, photoIds)))
      .returning({ id: photoGalleryPhotos.id });

    if (deleted.length > 0) {
      await tx
        .update(photoGalleries)
        .set({
          coverPhotoId: sql`case when ${inArray(
            photoGalleries.coverPhotoId,
            deleted.map((row) => row.id),
          )} then null else ${photoGalleries.coverPhotoId} end`,
          updatedAt: sql`now()`,
        })
        .where(eq(photoGalleries.id, galleryId));
    }

    return deleted.length;
  });
}
