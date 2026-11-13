import { FULL_DISPLAY_WIDTH, loadMediaUrls, THUMB_DISPLAY_WIDTH } from "../../shared/media-urls";
import { findPhotosByGalleryId, findPublishedGalleryBySlug } from "./store";
import type { GetGalleryBySlugInput, GetGalleryBySlugResult, PublicGalleryPhotoView } from "./types";

// Duas consultas no plugin + dois lotes no MMS (miniatura e ampliada) em paralelo — antes era um
// getMediaAsset por foto, em série.
export async function getGalleryBySlug(input: GetGalleryBySlugInput): Promise<GetGalleryBySlugResult> {
  const slug = input.slug.trim();
  if (!slug) {
    return { success: true, data: null };
  }

  const gallery = await findPublishedGalleryBySlug(slug);
  if (!gallery) {
    return { success: true, data: null };
  }

  const photoRecords = await findPhotosByGalleryId(gallery.id);
  const mediaIds = photoRecords.map((photo) => photo.mediaId);
  const [thumbs, fulls] = await Promise.all([
    loadMediaUrls(mediaIds, THUMB_DISPLAY_WIDTH),
    loadMediaUrls(mediaIds, FULL_DISPLAY_WIDTH),
  ]);

  const photos: PublicGalleryPhotoView[] = photoRecords.flatMap((photo) => {
    const thumbUrl = thumbs[photo.mediaId];
    const fullUrl = fulls[photo.mediaId];
    return thumbUrl && fullUrl ? [{ id: photo.id, thumbUrl, fullUrl, caption: photo.caption }] : [];
  });

  return {
    success: true,
    data: {
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      category: gallery.category,
      description: gallery.description,
      eventDate: gallery.eventDate,
      publishedAt: gallery.publishedAt,
      photos,
    },
  };
}
