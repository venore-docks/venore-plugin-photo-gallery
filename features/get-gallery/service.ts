import { findGalleryById } from "../update-gallery/store";
import type { GetGalleryInput, GetGalleryResult } from "./types";

export async function getGallery(input: GetGalleryInput): Promise<GetGalleryResult> {
  return { success: true, data: await findGalleryById(input.galleryId) };
}
