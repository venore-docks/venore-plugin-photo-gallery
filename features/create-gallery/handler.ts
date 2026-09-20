import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { createGallery } from "./service";
import { validateCreateGalleryInput } from "./validation";
import type { CreateGalleryInput, CreateGalleryResult } from "./types";

export async function createGalleryHandler(input: CreateGalleryInput): Promise<CreateGalleryResult> {
  const validationError = validateCreateGalleryInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createGallery({ ...input, actorId: authz.actorId });
}
