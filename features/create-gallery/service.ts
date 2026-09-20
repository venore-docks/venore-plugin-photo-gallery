import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { insertGallery } from "./store";
import type { CreateGalleryCommand, CreateGalleryResult } from "./types";

export async function createGallery(command: CreateGalleryCommand): Promise<CreateGalleryResult> {
  const handle = beginOperation({
    useCase: "photo-gallery.create-gallery",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const record = await insertGallery(command);

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
