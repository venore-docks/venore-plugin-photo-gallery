import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { validateGalleryFields } from "../../shared/validation";
import { updateGallery } from "./service";
import type { UpdateGalleryInput, UpdateGalleryResult } from "./types";

export async function updateGalleryHandler(input: UpdateGalleryInput): Promise<UpdateGalleryResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "galleryId não pode ser vazio." } };
  }
  const validationError = validateGalleryFields(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateGallery({ ...input, actorId: authz.actorId });
}
