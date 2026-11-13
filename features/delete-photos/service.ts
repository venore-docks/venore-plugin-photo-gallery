import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { deletePhotosFromGallery } from "./store";
import type { DeletePhotosCommand, DeletePhotosResult } from "./types";

export async function deletePhotos(command: DeletePhotosCommand): Promise<DeletePhotosResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.delete-photos",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const deletedCount = await deletePhotosFromGallery(command.galleryId, command.photoIds);
  if (deletedCount === 0) {
    const error = { code: "photo-gallery.not_found", message: "Nenhuma das fotos foi encontrada nesta galeria." };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { deletedCount } };
}
