import type { Metadata } from "next";
import { loadPublicGallery } from "./load-gallery";

// Título/descrição/imagem de preview (link compartilhado no WhatsApp etc.) da página da galeria.
export async function buildGalleryMetadata(slug: string): Promise<Metadata> {
  const result = await loadPublicGallery(slug);
  if (!result.success || !result.data) return {};

  const gallery = result.data;
  const description = gallery.description?.slice(0, 200) || `Fotos: ${gallery.title}`;
  const image = gallery.photos[0]?.fullUrl;
  return {
    title: gallery.title,
    description,
    openGraph: { title: gallery.title, description, ...(image ? { images: [{ url: image }] } : {}) },
  };
}
