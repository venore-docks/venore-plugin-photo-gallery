import type { OperationResult } from "@venore/plugin-sdk";

// photoId null = volta pra capa automática (primeira foto pela ordem).
export type SetGalleryCoverCommand = { galleryId: string; photoId: string | null; actorId: string };
export type SetGalleryCoverInput = Omit<SetGalleryCoverCommand, "actorId">;
export type SetGalleryCoverResult = OperationResult<{ coverPhotoId: string | null }>;
