import type { OperationResult } from "@venore/plugin-sdk";

export type GetGalleryBySlugInput = { slug: string };

export type PublicGalleryPhotoView = {
  id: string;
  // Variante pequena pra grade; fullUrl é a do lightbox.
  thumbUrl: string;
  fullUrl: string;
  caption: string | null;
};

export type PublicGalleryDetailView = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  eventDate: string | null;
  publishedAt: Date | null;
  photos: PublicGalleryPhotoView[];
};

export type GetGalleryBySlugResult = OperationResult<PublicGalleryDetailView | null>;
