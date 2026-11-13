import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { validateGalleryFields } from "../../shared/validation";
import { createGallery } from "./service";
import type { CreateGalleryInput, CreateGalleryResult } from "./types";

export async function createGalleryHandler(input: CreateGalleryInput): Promise<CreateGalleryResult> {
  const validationError = validateGalleryFields(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("photo-gallery.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createGallery({ ...input, actorId: authz.actorId });
}
