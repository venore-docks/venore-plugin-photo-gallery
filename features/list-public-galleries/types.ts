import type { OperationResult } from "@venore/plugin-sdk";

export type ListPublicGalleriesInput = {
  // Filtra pela categoria (sem diferenciar maiúscula/minúscula). Vazio = todas.
  category?: string | null;
  limit?: number;
};

export type PublicGalleryView = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  eventDate: string | null;
  publishedAt: Date | null;
  photoCount: number;
  coverUrl: string | null;
};

export type ListPublicGalleriesResult = OperationResult<PublicGalleryView[]>;
