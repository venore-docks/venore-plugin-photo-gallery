import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleryPhotos } from "../../database/schema";

// Só remove a linha de vínculo (galeria <-> mediaId) — o MediaAsset em si fica intacto no
// contexts/media (mesmo racional de delete-gallery/store.ts: um plugin não decide o ciclo de vida
// de um asset que outra parte do sistema pode estar referenciando).
export async function deletePhotoById(id: string): Promise<boolean> {
  const rows = await db.delete(photoGalleryPhotos).where(eq(photoGalleryPhotos.id, id)).returning({ id: photoGalleryPhotos.id });
  return rows.length > 0;
}
