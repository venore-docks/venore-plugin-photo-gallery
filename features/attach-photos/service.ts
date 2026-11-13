import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { getMediaAsset } from "@venore/plugin-sdk/media";
import { appendPhotosToGallery } from "./store";
import type { AttachPhotosCommand, AttachPhotosResult } from "./types";

// Só imagem raster/SVG entra na galeria — o MMS aceita PDF, vídeo e áudio também.
async function isReadableImage(mediaId: string): Promise<boolean> {
  const result = await getMediaAsset({ id: mediaId });
  return result.success && result.data !== null && result.data.contentType.startsWith("image/");
}

export async function attachPhotos(command: AttachPhotosCommand): Promise<AttachPhotosResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.attach-photos",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  // Conferência no MMS com a sessão do ator: id inventado, asset apagado, não-imagem ou asset
  // que ele não pode ler não vira foto (a leitura pública depois recortaria de qualquer jeito).
  const checks = await Promise.all(command.mediaIds.map(async (id) => [id, await isReadableImage(id)] as const));
  const accepted = checks.filter(([, ok]) => ok).map(([id]) => id);
  const rejectedMediaIds = checks.filter(([, ok]) => !ok).map(([id]) => id);

  if (accepted.length === 0) {
    const error = { code: "photo-gallery.invalid_media", message: "Nenhum dos arquivos é uma imagem disponível na biblioteca de mídia." };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  const appended = await appendPhotosToGallery(command.galleryId, accepted);
  if (!appended) {
    const error = { code: "photo-gallery.not_found", message: "Galeria não encontrada." };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return {
    success: true,
    data: { attached: appended.inserted, alreadyInGallery: appended.alreadyInGallery, rejectedMediaIds },
  };
}
