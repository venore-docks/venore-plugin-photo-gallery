import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { setPhotoCaption } from "./store";
import type { UpdatePhotoCaptionCommand, UpdatePhotoCaptionResult } from "./types";

export async function updatePhotoCaption(command: UpdatePhotoCaptionCommand): Promise<UpdatePhotoCaptionResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.update-photo-caption",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const record = await setPhotoCaption(command.galleryId, command.photoId, command.caption?.trim() || null);
  if (!record) {
    const error = { code: "photo-gallery.not_found", message: "Foto não encontrada nesta galeria." };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
