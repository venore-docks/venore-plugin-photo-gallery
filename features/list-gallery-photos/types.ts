import type { OperationResult } from "@venore/plugin-sdk";

export type GalleryPhotoAdminView = {
  id: string;
  mediaId: string;
  // null = asset sumiu do MMS (apagado) ou o ator não pode lê-lo — a foto aparece como
  // indisponível no admin pra poder ser removida, em vez de sumir sem explicação.
  thumbUrl: string | null;
  caption: string | null;
  order: number;
};
export type ListGalleryPhotosInput = { galleryId: string };
export type ListGalleryPhotosResult = OperationResult<GalleryPhotoAdminView[]>;
