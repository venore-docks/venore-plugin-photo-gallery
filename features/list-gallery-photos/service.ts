import { loadMediaUrls, THUMB_DISPLAY_WIDTH } from "../../shared/media-urls";
import { findPhotosByGalleryId } from "../get-gallery-by-slug/store";
import type { ListGalleryPhotosInput, ListGalleryPhotosResult } from "./types";

export async function listGalleryPhotos(input: ListGalleryPhotosInput): Promise<ListGalleryPhotosResult> {
  const photos = await findPhotosByGalleryId(input.galleryId);
  const urls = await loadMediaUrls(
    photos.map((photo) => photo.mediaId),
    THUMB_DISPLAY_WIDTH,
  );

  return {
    success: true,
    data: photos.map((photo) => ({
      id: photo.id,
      mediaId: photo.mediaId,
      thumbUrl: urls[photo.mediaId] ?? null,
      caption: photo.caption,
      order: photo.order,
    })),
  };
}
