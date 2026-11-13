import type { OperationResult } from "@venore/plugin-sdk";

// photoIds = TODAS as fotos da galeria, na ordem nova.
export type ReorderPhotosCommand = { galleryId: string; photoIds: string[]; actorId: string };
export type ReorderPhotosInput = Omit<ReorderPhotosCommand, "actorId">;
export type ReorderPhotosResult = OperationResult<{ photoIds: string[] }>;
