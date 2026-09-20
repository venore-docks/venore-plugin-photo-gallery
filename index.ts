export { photoGalleryBreadcrumbSegments } from "./breadcrumbs";

export { createGalleryHandler as createGallery } from "./features/create-gallery/handler";
export { updateGalleryHandler as updateGallery } from "./features/update-gallery/handler";
export { deleteGalleryHandler as deleteGallery } from "./features/delete-gallery/handler";
export { listGalleriesHandler as listGalleries } from "./features/list-galleries/handler";
export { listPublicGalleriesHandler as listPublicGalleries } from "./features/list-public-galleries/handler";
export { getGalleryBySlugHandler as getGalleryBySlug } from "./features/get-gallery-by-slug/handler";

export { addPhotosHandler as addPhotos } from "./features/add-photos/handler";
export { deletePhotoHandler as deletePhoto } from "./features/delete-photo/handler";
export { listGalleryPhotosHandler as listGalleryPhotos } from "./features/list-gallery-photos/handler";

// Ponto de extensão "blocks" do plugin engine, mesmo padrão dos outros plugins do Portal do
// Colaborador (venore-plugin-birthdays, venore-plugin-vagas, venore-plugin-calendar).
export { blockDefinitions, blockRenderers } from "./blocks";

export type { GalleryRecord, GalleryStatus, GalleryPhotoRecord } from "./contracts/types";

export type { CreateGalleryInput, CreateGalleryResult } from "./features/create-gallery/types";
export type { UpdateGalleryInput, UpdateGalleryResult } from "./features/update-gallery/types";
export type { DeleteGalleryInput, DeleteGalleryResult } from "./features/delete-gallery/types";
export type { ListGalleriesResult } from "./features/list-galleries/types";
export type { PublicGalleryView, ListPublicGalleriesResult } from "./features/list-public-galleries/types";
export type {
  GetGalleryBySlugInput,
  GetGalleryBySlugResult,
  PublicGalleryDetailView,
  PublicGalleryPhotoView,
} from "./features/get-gallery-by-slug/types";

export type { PhotoUploadFile, AddPhotosInput, AddPhotosResult } from "./features/add-photos/types";
export type { DeletePhotoInput, DeletePhotoResult } from "./features/delete-photo/types";
export type {
  GalleryPhotoAdminView,
  ListGalleryPhotosInput,
  ListGalleryPhotosResult,
} from "./features/list-gallery-photos/types";
