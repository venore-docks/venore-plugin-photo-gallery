import { db } from "@venore/plugin-sdk";
import { photoGalleries } from "../../database/schema";
import { generateGallerySlug } from "../../shared/generate-slug";
import type { GalleryRecord } from "../../contracts/types";
import type { CreateGalleryCommand } from "./types";

// Mesma estratégia de colisão de slug de venore-plugin-vagas/features/create-job/store.ts.
export async function insertGallery(command: CreateGalleryCommand): Promise<GalleryRecord> {
  const baseSlug = generateGallerySlug(command.title) || "galeria";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

    try {
      const status = command.status ?? "draft";
      const [row] = await db
        .insert(photoGalleries)
        .values({
          title: command.title.trim(),
          slug,
          category: command.category?.trim() || null,
          description: command.description?.trim() || null,
          status,
          publishedAt: status === "published" ? new Date() : null,
          createdByUserId: command.actorId,
        })
        .returning();
      return row as GalleryRecord;
    } catch (cause) {
      const isUniqueViolation = cause instanceof Error && "code" in cause && (cause as { code?: string }).code === "23505";
      if (!isUniqueViolation || attempt === 4) throw cause;
    }
  }

  throw new Error("Não foi possível gerar um slug único para a galeria.");
}
