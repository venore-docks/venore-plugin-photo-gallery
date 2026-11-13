import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { isPermutationOf } from "../../shared/reorder";
import { applyPhotoOrder } from "./store";
import type { ReorderPhotosCommand, ReorderPhotosResult } from "./types";

export async function reorderPhotos(command: ReorderPhotosCommand): Promise<ReorderPhotosResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.reorder-photos",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const applied = await applyPhotoOrder(command.galleryId, command.photoIds, isPermutationOf);
  if (!applied) {
    const error = {
      code: "photo-gallery.stale_order",
      message: "As fotos desta galeria mudaram enquanto você reordenava. Recarregue a página e tente de novo.",
    };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { photoIds: command.photoIds } };
}
