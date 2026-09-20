import { getMediaAsset } from "@venore/plugin-sdk/media";
import { findPhotosByGalleryId } from "../get-gallery-by-slug/store";
import type { GalleryPhotoAdminView, ListGalleryPhotosInput, ListGalleryPhotosResult } from "./types";

export async function listGalleryPhotos(input: ListGalleryPhotosInput): Promise<ListGalleryPhotosResult> {
  const photos = await findPhotosByGalleryId(input.galleryId);

  const views: GalleryPhotoAdminView[] = [];
  for (const photo of photos) {
    const mediaResult = await getMediaAsset({ id: photo.mediaId });
    if (mediaResult.success && mediaResult.data) {
      views.push({ id: photo.id, url: mediaResult.data.url, caption: photo.caption, order: photo.order });
    }
  }

  return { success: true, data: views };
}
