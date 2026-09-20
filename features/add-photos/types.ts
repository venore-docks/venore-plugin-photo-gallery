import type { OperationResult } from "@venore/plugin-sdk";
import type { GalleryPhotoRecord } from "../../contracts/types";

export type PhotoUploadFile = { filename: string; contentType: string; size: number; data: Buffer };

export type AddPhotosCommand = {
  galleryId: string;
  files: PhotoUploadFile[];
  actorId: string;
};

export type AddPhotosInput = Omit<AddPhotosCommand, "actorId">;
export type AddPhotosResult = OperationResult<GalleryPhotoRecord[]>;
