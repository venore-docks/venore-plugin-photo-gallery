import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listGalleries } from "./service";
import type { ListGalleriesResult } from "./types";

export async function listGalleriesHandler(): Promise<ListGalleriesResult> {
  const authz = await authorizeActor("photo-gallery.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return listGalleries();
}
