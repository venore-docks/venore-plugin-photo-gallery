export { photoGalleryBreadcrumbSegments } from "./breadcrumbs";

export { createGalleryHandler as createGallery } from "./features/create-gallery/handler";
export { updateGalleryHandler as updateGallery } from "./features/update-gallery/handler";
export { deleteGalleryHandler as deleteGallery } from "./features/delete-gallery/handler";
export { getGalleryHandler as getGallery } from "./features/get-gallery/handler";
export { listGalleriesHandler as listGalleries } from "./features/list-galleries/handler";
export { listPublicGalleriesHandler as listPublicGalleries } from "./features/list-public-galleries/handler";
export { getGalleryBySlugHandler as getGalleryBySlug } from "./features/get-gallery-by-slug/handler";
export { setGalleryCoverHandler as setGalleryCover } from "./features/set-gallery-cover/handler";

// Fotos = vínculos com assets do MMS (upload é do core: uploadFileToMediaLibrary no SDK).
export { attachPhotosHandler as attachPhotos } from "./features/attach-photos/handler";
export { deletePhotosHandler as deletePhotos } from "./features/delete-photos/handler";
export { updatePhotoCaptionHandler as updatePhotoCaption } from "./features/update-photo-caption/handler";
export { reorderPhotosHandler as reorderPhotos } from "./features/reorder-photos/handler";
export { listGalleryPhotosHandler as listGalleryPhotos } from "./features/list-gallery-photos/handler";

// Ponto de extensão "blocks" do plugin engine, mesmo padrão dos outros plugins do Portal do
// Colaborador (venore-plugin-birthdays, venore-plugin-vagas, venore-plugin-calendar).
export { blockDefinitions, blockRenderers } from "./blocks";

export type { GalleryRecord, GalleryStatus, GalleryPhotoRecord, PhotoGalleryError } from "./contracts/types";

export type { CreateGalleryInput, CreateGalleryResult } from "./features/create-gallery/types";
export type { UpdateGalleryInput, UpdateGalleryResult } from "./features/update-gallery/types";
export type { DeleteGalleryInput, DeleteGalleryResult } from "./features/delete-gallery/types";
export type { GetGalleryInput, GetGalleryResult } from "./features/get-gallery/types";
export type { GalleryAdminSummary, ListGalleriesResult } from "./features/list-galleries/types";
export type {
  ListPublicGalleriesInput,
  PublicGalleryView,
  ListPublicGalleriesResult,
} from "./features/list-public-galleries/types";
export type {
  GetGalleryBySlugInput,
  GetGalleryBySlugResult,
  PublicGalleryDetailView,
  PublicGalleryPhotoView,
} from "./features/get-gallery-by-slug/types";
export type { SetGalleryCoverInput, SetGalleryCoverResult } from "./features/set-gallery-cover/types";

export type { AttachPhotosInput, AttachPhotosOutcome, AttachPhotosResult } from "./features/attach-photos/types";
export type { DeletePhotosInput, DeletePhotosResult } from "./features/delete-photos/types";
export type { UpdatePhotoCaptionInput, UpdatePhotoCaptionResult } from "./features/update-photo-caption/types";
export type { ReorderPhotosInput, ReorderPhotosResult } from "./features/reorder-photos/types";
export type {
  GalleryPhotoAdminView,
  ListGalleryPhotosInput,
  ListGalleryPhotosResult,
} from "./features/list-gallery-photos/types";
