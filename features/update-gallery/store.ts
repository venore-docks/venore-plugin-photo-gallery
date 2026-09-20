import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries } from "../../database/schema";
import type { GalleryRecord } from "../../contracts/types";

export async function findGalleryById(id: string): Promise<GalleryRecord | null> {
  const [row] = await db.select().from(photoGalleries).where(eq(photoGalleries.id, id)).limit(1);
  return (row as GalleryRecord) ?? null;
}

export async function applyGalleryUpdate(input: {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  status: GalleryRecord["status"];
  publishedAt: Date | null;
}): Promise<GalleryRecord> {
  const [row] = await db
    .update(photoGalleries)
    .set({
      title: input.title,
      category: input.category,
      description: input.description,
      status: input.status,
      publishedAt: input.publishedAt,
      updatedAt: sql`now()`,
    })
    .where(eq(photoGalleries.id, input.id))
    .returning();

  return row as GalleryRecord;
}
