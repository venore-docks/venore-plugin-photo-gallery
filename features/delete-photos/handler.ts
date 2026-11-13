import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { uniqueIds, validateIdBatch } from "../../shared/validation";
import { deletePhotos } from "./service";
import type { DeletePhotosInput, DeletePhotosResult } from "./types";

export async function deletePhotosHandler(input: DeletePhotosInput): Promise<DeletePhotosResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "galleryId não pode ser vazio." } };
  }
  const photoIds = uniqueIds(input.photoIds);
  const batchError = validateIdBatch(photoIds, "foto");
  if (batchError) {
    return { success: false, error: batchError };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deletePhotos({ galleryId: input.galleryId, photoIds, actorId: authz.actorId });
}
