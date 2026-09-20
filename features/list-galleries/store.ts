import { desc } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { photoGalleries } from "../../database/schema";
import type { GalleryRecord } from "../../contracts/types";

export async function findAllGalleries(): Promise<GalleryRecord[]> {
  const rows = await db.select().from(photoGalleries).orderBy(desc(photoGalleries.createdAt));
  return rows as GalleryRecord[];
}
