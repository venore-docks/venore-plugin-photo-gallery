import { listPublicGalleries } from "./service";
import type { ListPublicGalleriesResult } from "./types";

// Sem authorizeActor de propósito — listagem de galerias publicadas é pública, mesmo espírito de
// list-public-jobs no venore-plugin-vagas.
export async function listPublicGalleriesHandler(): Promise<ListPublicGalleriesResult> {
  return listPublicGalleries();
}
