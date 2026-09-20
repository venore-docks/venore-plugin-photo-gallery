import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listGalleryPhotos } from "./service";
import type { ListGalleryPhotosInput, ListGalleryPhotosResult } from "./types";

export async function listGalleryPhotosHandler(input: ListGalleryPhotosInput): Promise<ListGalleryPhotosResult> {
  const authz = await authorizeActor("photo-gallery.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return listGalleryPhotos(input);
}
