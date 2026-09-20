import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { uploadMediaAsset } from "@venore/plugin-sdk/media";
import { findMaxPhotoOrder, insertPhoto } from "./store";
import type { AddPhotosCommand, AddPhotosResult } from "./types";
import type { GalleryPhotoRecord } from "../../contracts/types";

// Cada arquivo passa pelo upload do core (contexts/media — sanitização, checksum, storage) antes
// de virar uma linha de foto aqui; o plugin nunca grava bytes direto, só referencia o mediaId
// resultante (regra de fronteira: media é domínio do core, não do plugin).
export async function addPhotos(command: AddPhotosCommand): Promise<AddPhotosResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.add-photos",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  let nextOrder = (await findMaxPhotoOrder(command.galleryId)) + 1;
  const created: GalleryPhotoRecord[] = [];

  for (const file of command.files) {
    const uploadResult = await uploadMediaAsset({
      filename: file.filename,
      contentType: file.contentType,
      size: file.size,
      data: file.data,
      visibility: "public",
    });

    if (!uploadResult.success) {
      endOperation(handle, { success: false, error: uploadResult.error });
      return { success: false, error: uploadResult.error };
    }

    const photo = await insertPhoto({ galleryId: command.galleryId, mediaId: uploadResult.data.id, order: nextOrder });
    created.push(photo);
    nextOrder += 1;
  }

  endOperation(handle, { success: true });
  return { success: true, data: created };
}
