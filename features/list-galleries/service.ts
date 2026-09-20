import { findAllGalleries } from "./store";
import type { ListGalleriesResult } from "./types";

export async function listGalleries(): Promise<ListGalleriesResult> {
  return { success: true, data: await findAllGalleries() };
}
