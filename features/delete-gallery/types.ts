import type { OperationResult } from "@venore/plugin-sdk";

export type DeleteGalleryCommand = { galleryId: string; actorId: string };
export type DeleteGalleryInput = Omit<DeleteGalleryCommand, "actorId">;
export type DeleteGalleryResult = OperationResult<{ galleryId: string }>;
