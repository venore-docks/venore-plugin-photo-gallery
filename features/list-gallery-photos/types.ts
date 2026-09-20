import type { OperationResult } from "@venore/plugin-sdk";

export type GalleryPhotoAdminView = { id: string; url: string; caption: string | null; order: number };
export type ListGalleryPhotosInput = { galleryId: string };
export type ListGalleryPhotosResult = OperationResult<GalleryPhotoAdminView[]>;
