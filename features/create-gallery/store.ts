import { db } from "@venore/plugin-sdk";
import { photoGalleries } from "../../database/schema";
import { generateGallerySlug } from "../../shared/generate-slug";
import type { GalleryRecord, GalleryStatus } from "../../contracts/types";

export type InsertGalleryValues = {
  title: string;
  category: string | null;
  description: string | null;
  eventDate: string | null;
  status: GalleryStatus;
  publishedAt: Date | null;
  createdByUserId: string;
};

// Mesma estratégia de colisão de slug de venore-plugin-vagas/features/create-job/store.ts.
export async function insertGallery(values: InsertGalleryValues): Promise<GalleryRecord> {
  const baseSlug = generateGallerySlug(values.title) || "galeria";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

    try {
      const [row] = await db
        .insert(photoGalleries)
        .values({ ...values, slug })
        .returning();
      return row as GalleryRecord;
    } catch (cause) {
      const isUniqueViolation = cause instanceof Error && "code" in cause && (cause as { code?: string }).code === "23505";
      if (!isUniqueViolation || attempt === 4) throw cause;
    }
  }

  throw new Error("Não foi possível gerar um slug único para a galeria.");
}
