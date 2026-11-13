import type { OperationResult } from "@venore/plugin-sdk";

export type DeletePhotosCommand = { galleryId: string; photoIds: string[]; actorId: string };
export type DeletePhotosInput = Omit<DeletePhotosCommand, "actorId">;
export type DeletePhotosResult = OperationResult<{ deletedCount: number }>;
