import type { OperationResult } from "@venore/plugin-sdk";
import type { GalleryRecord } from "../../contracts/types";

export type GetGalleryInput = { galleryId: string };
export type GetGalleryResult = OperationResult<GalleryRecord | null>;
