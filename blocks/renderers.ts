import type { BlockRendererComponent } from "@venore/plugin-sdk";
import { PhotoGalleryGridBlock } from "./photo-gallery-grid-block";

export const blockRenderers: Record<string, BlockRendererComponent> = {
  "photo-gallery.grid": PhotoGalleryGridBlock,
};
