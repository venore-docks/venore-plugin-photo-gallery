import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { PHOTO_CAPTION_MAX } from "../../shared/validation";
import { updatePhotoCaption } from "./service";
import type { UpdatePhotoCaptionInput, UpdatePhotoCaptionResult } from "./types";

export async function updatePhotoCaptionHandler(input: UpdatePhotoCaptionInput): Promise<UpdatePhotoCaptionResult> {
  if (input.galleryId.trim().length === 0 || input.photoId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "Foto inválida." } };
  }
  if ((input.caption?.trim().length ?? 0) > PHOTO_CAPTION_MAX) {
    return {
      success: false,
      error: { code: "photo-gallery.invalid_caption", message: `A legenda pode ter no máximo ${PHOTO_CAPTION_MAX} caracteres.` },
    };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updatePhotoCaption({ ...input, actorId: authz.actorId });
}
