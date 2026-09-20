import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { updateGallery } from "./service";
import type { UpdateGalleryInput, UpdateGalleryResult } from "./types";

export async function updateGalleryHandler(input: UpdateGalleryInput): Promise<UpdateGalleryResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "galleryId não pode ser vazio." } };
  }
  if (input.title.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_title", message: "O título da galeria não pode ser vazio." } };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateGallery({ ...input, actorId: authz.actorId });
}
