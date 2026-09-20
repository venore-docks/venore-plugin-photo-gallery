import type { OperationResult } from "@venore/plugin-sdk";
import type { GalleryRecord, GalleryStatus } from "../../contracts/types";

export type UpdateGalleryCommand = {
  galleryId: string;
  title: string;
  category?: string | null;
  description?: string | null;
  status: GalleryStatus;
  actorId: string;
};

export type UpdateGalleryInput = Omit<UpdateGalleryCommand, "actorId">;
export type UpdateGalleryResult = OperationResult<GalleryRecord>;
