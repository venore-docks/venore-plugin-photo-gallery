import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { deleteGalleryById } from "./store";
import type { DeleteGalleryCommand, DeleteGalleryResult } from "./types";

export async function deleteGallery(command: DeleteGalleryCommand): Promise<DeleteGalleryResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.delete-gallery",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const deleted = await deleteGalleryById(command.galleryId);
  if (!deleted) {
    const error = { code: "photo-gallery.not_found", message: `Galeria "${command.galleryId}" não encontrada.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { galleryId: command.galleryId } };
}
