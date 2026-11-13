import type { OperationResult } from "@venore/plugin-sdk";
import type { GalleryRecord } from "../../contracts/types";

export type GalleryAdminSummary = GalleryRecord & { photoCount: number; coverUrl: string | null };
export type ListGalleriesResult = OperationResult<GalleryAdminSummary[]>;
