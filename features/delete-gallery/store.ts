import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries } from "../../database/schema";

// ON DELETE CASCADE na FK de photoGalleryPhotos.galleryId já remove as fotos junto — mas os
// MediaAssets referenciados por mediaId ficam órfãos no contexts/media (não são apagados daqui:
// um plugin não decide o ciclo de vida de um asset que pode estar em uso em outro lugar).
export async function deleteGalleryById(id: string): Promise<boolean> {
  const rows = await db.delete(photoGalleries).where(eq(photoGalleries.id, id)).returning({ id: photoGalleries.id });
  return rows.length > 0;
}
