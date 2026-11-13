import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries } from "../../database/schema";
import { coverMediaIdColumn, photoCountColumn } from "../../shared/gallery-sql";
import type { GalleryWithStatsRow } from "../list-galleries/store";

// Galerias publicadas com contagem e capa numa consulta só (antes: 1 consulta de capa + 1
// getMediaAsset por galeria). Ordem: data do evento e, sem ela, a de publicação — mais recente
// primeiro.
export async function findPublishedGalleriesWithStats(filter: {
  category: string | null;
  limit: number;
}): Promise<GalleryWithStatsRow[]> {
  const rows = await db
    .select({ ...getTableColumns(photoGalleries), photoCount: photoCountColumn, coverMediaId: coverMediaIdColumn })
    .from(photoGalleries)
    .where(
      and(
        eq(photoGalleries.status, "published"),
        filter.category ? sql`lower(${photoGalleries.category}) = lower(${filter.category})` : undefined,
      ),
    )
    .orderBy(
      desc(sql`coalesce(${photoGalleries.eventDate}, (${photoGalleries.publishedAt})::date)`),
      desc(photoGalleries.publishedAt),
    )
    .limit(filter.limit);
  return rows as GalleryWithStatsRow[];
}
