import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { writeGalleryCover } from "./store";
import type { SetGalleryCoverCommand, SetGalleryCoverResult } from "./types";

export async function setGalleryCover(command: SetGalleryCoverCommand): Promise<SetGalleryCoverResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.set-gallery-cover",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const updated = await writeGalleryCover(command.galleryId, command.photoId);
  if (!updated) {
    const error = { code: "photo-gallery.not_found", message: "Galeria ou foto não encontrada." };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { coverPhotoId: command.photoId } };
}
