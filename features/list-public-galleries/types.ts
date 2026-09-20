import type { OperationResult } from "@venore/plugin-sdk";

export type PublicGalleryView = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  coverMediaUrl: string | null;
  publishedAt: Date | null;
};

export type ListPublicGalleriesResult = OperationResult<PublicGalleryView[]>;
