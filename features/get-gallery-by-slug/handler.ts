import { getGalleryBySlug } from "./service";
import type { GetGalleryBySlugInput, GetGalleryBySlugResult } from "./types";

// Sem authorizeActor de propósito — detalhe de galeria publicada é público, mesmo espírito de
// get-job-by-slug no venore-plugin-vagas.
export async function getGalleryBySlugHandler(input: GetGalleryBySlugInput): Promise<GetGalleryBySlugResult> {
  return getGalleryBySlug(input);
}
