import type { OperationResult } from "@venore/plugin-sdk";
import type { GalleryRecord, GalleryStatus } from "../../contracts/types";

export type CreateGalleryCommand = {
  title: string;
  category?: string | null;
  description?: string | null;
  eventDate?: string | null;
  status?: GalleryStatus;
  actorId: string;
};

export type CreateGalleryInput = Omit<CreateGalleryCommand, "actorId">;
export type CreateGalleryResult = OperationResult<GalleryRecord>;
