import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { deletePhotoById } from "./store";
import type { DeletePhotoCommand, DeletePhotoResult } from "./types";

export async function deletePhoto(command: DeletePhotoCommand): Promise<DeletePhotoResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.delete-photo",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const deleted = await deletePhotoById(command.photoId);
  if (!deleted) {
    const error = { code: "photo-gallery.not_found", message: `Foto "${command.photoId}" não encontrada.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { photoId: command.photoId } };
}
