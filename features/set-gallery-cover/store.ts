import { and, eq, exists, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries, photoGalleryPhotos } from "../../database/schema";

// Só aceita foto que pertence à MESMA galeria (EXISTS no próprio UPDATE — sem janela entre
// conferir e gravar). false = galeria não existe ou foto é de outra galeria.
export async function writeGalleryCover(galleryId: string, photoId: string | null): Promise<boolean> {
  const photoBelongs = photoId
    ? exists(
        db
          .select({ one: sql`1` })
          .from(photoGalleryPhotos)
          .where(and(eq(photoGalleryPhotos.id, photoId), eq(photoGalleryPhotos.galleryId, galleryId))),
      )
    : undefined;

  const rows = await db
    .update(photoGalleries)
    .set({ coverPhotoId: photoId, updatedAt: sql`now()` })
    .where(and(eq(photoGalleries.id, galleryId), photoBelongs))
    .returning({ id: photoGalleries.id });
  return rows.length > 0;
}
