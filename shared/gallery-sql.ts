import { sql } from "drizzle-orm";
import { photoGalleries, photoGalleryPhotos } from "../database/schema";

// Fragmentos de SELECT correlacionados — contagem e capa de cada galeria na MESMA consulta da
// listagem (antes: uma consulta de capa + um getMediaAsset por galeria). Ambos usam o índice
// (gallery_id, order).

export const photoCountColumn = sql<number>`(
  select count(*)::int from ${photoGalleryPhotos} as p where p.gallery_id = ${photoGalleries.id}
)`.mapWith(Number);

// Capa escolhida (se ainda pertence à galeria) ou, sem ela, a primeira foto pela ordem.
export const coverMediaIdColumn = sql<string | null>`coalesce(
  (select p.media_id from ${photoGalleryPhotos} as p
    where p.id = ${photoGalleries.coverPhotoId} and p.gallery_id = ${photoGalleries.id}),
  (select p.media_id from ${photoGalleryPhotos} as p
    where p.gallery_id = ${photoGalleries.id} order by p."order" asc, p.created_at asc limit 1)
)`;
