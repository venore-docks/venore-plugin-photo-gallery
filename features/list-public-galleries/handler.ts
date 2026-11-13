import { listPublicGalleries } from "./service";
import type { ListPublicGalleriesInput, ListPublicGalleriesResult } from "./types";

// Sem authorizeActor: quem pode ver a página é decisão do core (rota pública de plugin + "site só
// para logados", platform/site-access) e quem pode ver cada foto é decisão do MMS (visibilidade
// do asset). O plugin só filtra o próprio estado editorial (publicada).
export async function listPublicGalleriesHandler(input: ListPublicGalleriesInput = {}): Promise<ListPublicGalleriesResult> {
  return listPublicGalleries(input);
}
