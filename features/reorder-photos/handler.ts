import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { PHOTO_BATCH_MAX } from "../../shared/validation";
import { reorderPhotos } from "./service";
import type { ReorderPhotosInput, ReorderPhotosResult } from "./types";

export async function reorderPhotosHandler(input: ReorderPhotosInput): Promise<ReorderPhotosResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "galleryId não pode ser vazio." } };
  }
  if (input.photoIds.length === 0 || input.photoIds.length > PHOTO_BATCH_MAX * 5) {
    return { success: false, error: { code: "photo-gallery.invalid_order", message: "Ordem de fotos inválida." } };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return reorderPhotos({ ...input, actorId: authz.actorId });
}
