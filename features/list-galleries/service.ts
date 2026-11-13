import { loadMediaUrls, THUMB_DISPLAY_WIDTH } from "../../shared/media-urls";
import { findAllGalleriesWithStats } from "./store";
import type { ListGalleriesResult } from "./types";

// Uma consulta (galerias + contagem + id da capa) e um lote no MMS pras miniaturas.
export async function listGalleries(): Promise<ListGalleriesResult> {
  const rows = await findAllGalleriesWithStats();
  const urls = await loadMediaUrls(
    rows.flatMap((row) => (row.coverMediaId ? [row.coverMediaId] : [])),
    THUMB_DISPLAY_WIDTH,
  );

  return {
    success: true,
    data: rows.map(({ coverMediaId, ...gallery }) => ({
      ...gallery,
      coverUrl: coverMediaId ? (urls[coverMediaId] ?? null) : null,
    })),
  };
}
