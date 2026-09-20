import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { deleteGallery } from "./service";
import type { DeleteGalleryInput, DeleteGalleryResult } from "./types";

export async function deleteGalleryHandler(input: DeleteGalleryInput): Promise<DeleteGalleryResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "galleryId não pode ser vazio." } };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deleteGallery({ galleryId: input.galleryId, actorId: authz.actorId });
}
