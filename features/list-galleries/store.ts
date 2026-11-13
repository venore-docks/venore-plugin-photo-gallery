import { desc, getTableColumns } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries } from "../../database/schema";
import { coverMediaIdColumn, photoCountColumn } from "../../shared/gallery-sql";
import type { GalleryRecord } from "../../contracts/types";

export type GalleryWithStatsRow = GalleryRecord & { photoCount: number; coverMediaId: string | null };

export async function findAllGalleriesWithStats(): Promise<GalleryWithStatsRow[]> {
  const rows = await db
    .select({ ...getTableColumns(photoGalleries), photoCount: photoCountColumn, coverMediaId: coverMediaIdColumn })
    .from(photoGalleries)
    .orderBy(desc(photoGalleries.createdAt));
  return rows as GalleryWithStatsRow[];
}
