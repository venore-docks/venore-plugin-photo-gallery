import type { OperationResult } from "@venore/plugin-sdk";
import type { GalleryPhotoRecord } from "../../contracts/types";

export type UpdatePhotoCaptionCommand = { galleryId: string; photoId: string; caption: string | null; actorId: string };
export type UpdatePhotoCaptionInput = Omit<UpdatePhotoCaptionCommand, "actorId">;
export type UpdatePhotoCaptionResult = OperationResult<GalleryPhotoRecord>;
