import type { OperationResult } from "@venore/plugin-sdk";

export type GetGalleryBySlugInput = { slug: string };

export type PublicGalleryPhotoView = { id: string; url: string; caption: string | null };

export type PublicGalleryDetailView = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  photos: PublicGalleryPhotoView[];
};

export type GetGalleryBySlugResult = OperationResult<PublicGalleryDetailView | null>;
