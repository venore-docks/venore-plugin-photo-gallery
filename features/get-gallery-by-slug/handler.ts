import { getGalleryBySlug } from "./service";
import type { GetGalleryBySlugInput, GetGalleryBySlugResult } from "./types";

// Sem authorizeActor — mesmo racional de list-public-galleries/handler.ts: acesso à página é do
// core, acesso a cada foto é do MMS.
export async function getGalleryBySlugHandler(input: GetGalleryBySlugInput): Promise<GetGalleryBySlugResult> {
  return getGalleryBySlug(input);
}
