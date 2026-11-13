import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { getGallery } from "./service";
import type { GetGalleryInput, GetGalleryResult } from "./types";

// Leitura de admin (qualquer status) — a página de detalhe antes carregava a lista inteira pra
// achar um id.
export async function getGalleryHandler(input: GetGalleryInput): Promise<GetGalleryResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: true, data: null };
  }

  const authz = await authorizeActor("photo-gallery.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return getGallery(input);
}
