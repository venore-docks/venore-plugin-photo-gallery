import type { OperationResult } from "@venore/plugin-sdk";
import type { GalleryRecord } from "../../contracts/types";

export type ListGalleriesResult = OperationResult<GalleryRecord[]>;
