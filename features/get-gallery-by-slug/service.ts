import { getMediaAsset } from "@venore/plugin-sdk/media";
import { findPhotosByGalleryId, findPublishedGalleryBySlug } from "./store";
import type { GetGalleryBySlugInput, GetGalleryBySlugResult, PublicGalleryPhotoView } from "./types";

export async function getGalleryBySlug(input: GetGalleryBySlugInput): Promise<GetGalleryBySlugResult> {
  const gallery = await findPublishedGalleryBySlug(input.slug);
  if (!gallery) {
    return { success: true, data: null };
  }

  const photoRecords = await findPhotosByGalleryId(gallery.id);
  const photos: PublicGalleryPhotoView[] = [];

  for (const photo of photoRecords) {
    const mediaResult = await getMediaAsset({ id: photo.mediaId });
    if (mediaResult.success && mediaResult.data) {
      photos.push({ id: photo.id, url: mediaResult.data.url, caption: photo.caption });
    }
  }

  return {
    success: true,
    data: {
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      category: gallery.category,
      description: gallery.description,
      photos,
    },
  };
}
