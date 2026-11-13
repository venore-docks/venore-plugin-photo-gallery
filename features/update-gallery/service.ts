import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { normalizeGalleryFields } from "../../shared/validation";
import { applyGalleryUpdate, findGalleryById } from "./store";
import type { UpdateGalleryCommand, UpdateGalleryResult } from "./types";

export async function updateGallery(command: UpdateGalleryCommand): Promise<UpdateGalleryResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.update-gallery",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const existing = await findGalleryById(command.galleryId);
  if (!existing) {
    const error = { code: "photo-gallery.not_found", message: "Galeria não encontrada." };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  // publishedAt só é preenchido na primeira vez que a galeria entra em "published" — trocar pra
  // draft e voltar pra published não reinicia a data.
  const publishedAt = command.status === "published" ? (existing.publishedAt ?? new Date()) : existing.publishedAt;

  const record = await applyGalleryUpdate({
    id: command.galleryId,
    ...normalizeGalleryFields(command),
    status: command.status,
    publishedAt,
  });

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
