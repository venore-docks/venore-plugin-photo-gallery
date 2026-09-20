import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { deletePhoto } from "./service";
import type { DeletePhotoInput, DeletePhotoResult } from "./types";

export async function deletePhotoHandler(input: DeletePhotoInput): Promise<DeletePhotoResult> {
  if (input.photoId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "photoId não pode ser vazio." } };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deletePhoto({ photoId: input.photoId, actorId: authz.actorId });
}
