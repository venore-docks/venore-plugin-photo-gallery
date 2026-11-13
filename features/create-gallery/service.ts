import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { normalizeGalleryFields } from "../../shared/validation";
import { insertGallery } from "./store";
import type { CreateGalleryCommand, CreateGalleryResult } from "./types";

export async function createGallery(command: CreateGalleryCommand): Promise<CreateGalleryResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.create-gallery",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const status = command.status ?? "draft";
  const record = await insertGallery({
    ...normalizeGalleryFields(command),
    status,
    publishedAt: status === "published" ? new Date() : null,
    createdByUserId: command.actorId,
  });

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
