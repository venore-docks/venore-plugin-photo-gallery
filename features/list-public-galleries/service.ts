import { CARD_DISPLAY_WIDTH, loadMediaUrls } from "../../shared/media-urls";
import { findPublishedGalleriesWithStats } from "./store";
import type { ListPublicGalleriesInput, ListPublicGalleriesResult } from "./types";

export const PUBLIC_GALLERIES_MAX = 100;

export async function listPublicGalleries(input: ListPublicGalleriesInput = {}): Promise<ListPublicGalleriesResult> {
  const requested = Number.isFinite(input.limit) ? Math.trunc(input.limit as number) : PUBLIC_GALLERIES_MAX;
  const limit = Math.min(Math.max(requested, 1), PUBLIC_GALLERIES_MAX);
  const rows = await findPublishedGalleriesWithStats({ category: input.category?.trim() || null, limit });

  const urls = await loadMediaUrls(
    rows.flatMap((row) => (row.coverMediaId ? [row.coverMediaId] : [])),
    CARD_DISPLAY_WIDTH,
  );

  return {
    success: true,
    data: rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category,
      eventDate: row.eventDate,
      publishedAt: row.publishedAt,
      photoCount: row.photoCount,
      coverUrl: row.coverMediaId ? (urls[row.coverMediaId] ?? null) : null,
    })),
  };
}
