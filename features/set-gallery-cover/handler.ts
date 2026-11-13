import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { setGalleryCover } from "./service";
import type { SetGalleryCoverInput, SetGalleryCoverResult } from "./types";

export async function setGalleryCoverHandler(input: SetGalleryCoverInput): Promise<SetGalleryCoverResult> {
  if (input.galleryId.trim().length === 0) {
    return { success: false, error: { code: "photo-gallery.invalid_id", message: "galleryId não pode ser vazio." } };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return setGalleryCover({ galleryId: input.galleryId, photoId: input.photoId?.trim() || null, actorId: authz.actorId });
}
