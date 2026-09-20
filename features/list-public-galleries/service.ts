import { getMediaAsset } from "@venore/plugin-sdk/media";
import { findFirstPhotoByGalleryId, findPublishedGalleries } from "./store";
import type { ListPublicGalleriesResult, PublicGalleryView } from "./types";

export async function listPublicGalleries(): Promise<ListPublicGalleriesResult> {
  const galleries = await findPublishedGalleries();

  const views: PublicGalleryView[] = await Promise.all(
    galleries.map(async (gallery) => {
      const coverPhoto = await findFirstPhotoByGalleryId(gallery.id);
      const coverMediaUrl = coverPhoto ? await resolveMediaUrl(coverPhoto.mediaId) : null;

      return {
        id: gallery.id,
        title: gallery.title,
        slug: gallery.slug,
        category: gallery.category,
        coverMediaUrl,
        publishedAt: gallery.publishedAt,
      };
    }),
  );

  return { success: true, data: views };
}

async function resolveMediaUrl(mediaId: string): Promise<string | null> {
  const result = await getMediaAsset({ id: mediaId });
  return result.success && result.data ? result.data.url : null;
}
