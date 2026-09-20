import type { OperationResult } from "@venore/plugin-sdk";

export type DeletePhotoCommand = { photoId: string; actorId: string };
export type DeletePhotoInput = Omit<DeletePhotoCommand, "actorId">;
export type DeletePhotoResult = OperationResult<{ photoId: string }>;
