import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { uniqueIds, validateIdBatch } from "../../shared/validation";
import { attachPhotos } from "./service";
import type { AttachPhotosInput, AttachPhotosResult } from "./types";

export async function attachPhotosHandler(input: AttachPhotosInput): Promise<AttachPhotosResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "galleryId não pode ser vazio." } };
  }
  const mediaIds = uniqueIds(input.mediaIds);
  const batchError = validateIdBatch(mediaIds, "foto");
  if (batchError) {
    return { success: false, error: batchError };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return attachPhotos({ galleryId: input.galleryId, mediaIds, actorId: authz.actorId });
}
