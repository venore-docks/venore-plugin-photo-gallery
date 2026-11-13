import { getMediaAssetUrls } from "@venore/plugin-sdk/media";
import { PHOTO_BATCH_MAX } from "./validation";

// Larguras (CSS px) em que as fotos aparecem — o MMS devolve a menor variante WebP que cobre a
// largura na densidade 2x (pickMediaVariantUrl), em vez do original.
export const CARD_DISPLAY_WIDTH = 320; // capa no card da listagem / bloco
export const THUMB_DISPLAY_WIDTH = 240; // miniatura da grade do detalhe e do admin
export const FULL_DISPLAY_WIDTH = 960; // lightbox (cai na variante de 1920px)

// id do asset -> URL, em lotes de até 200 (limite do getMediaAssetUrls), lotes em paralelo. A
// visibilidade é a do MMS: asset que o visitante não pode ler (ou apagado) simplesmente não volta
// — quem chama descarta a foto, sem decidir acesso por conta própria.
export async function loadMediaUrls(ids: readonly string[], displayWidth?: number): Promise<Record<string, string>> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return {};

  const batches: string[][] = [];
  for (let index = 0; index < unique.length; index += PHOTO_BATCH_MAX) {
    batches.push(unique.slice(index, index + PHOTO_BATCH_MAX));
  }

  const results = await Promise.all(batches.map((batch) => getMediaAssetUrls({ ids: batch, displayWidth })));
  const urls: Record<string, string> = {};
  for (const result of results) {
    if (result.success) Object.assign(urls, result.data);
  }
  return urls;
}
