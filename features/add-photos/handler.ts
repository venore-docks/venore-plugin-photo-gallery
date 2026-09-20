import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { addPhotos } from "./service";
import type { AddPhotosInput, AddPhotosResult } from "./types";

export async function addPhotosHandler(input: AddPhotosInput): Promise<AddPhotosResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_gallery_id", message: "galleryId não pode ser vazio." } };
  }
  if (input.files.length === 0) {
    return { success: false, error: { code: "photo-gallery.no_files", message: "Selecione ao menos uma foto." } };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return addPhotos({ ...input, actorId: authz.actorId });
}
