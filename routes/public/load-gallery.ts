import { cache } from "react";
import { getGalleryBySlug } from "../../index";

// Uma leitura por request: generateMetadata e a página pedem a mesma galeria (chave = slug, não
// um objeto novo a cada chamada, senão o cache do React não deduplica).
export const loadPublicGallery = cache((slug: string) => getGalleryBySlug({ slug }));
