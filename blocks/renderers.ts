import type { BlockRendererComponent } from "@venore/plugin-sdk";
import { PhotoGalleryAlbumBlock } from "./photo-gallery-album-block";
import { PhotoGalleryGridBlock } from "./photo-gallery-grid-block";

export const blockRenderers: Record<string, BlockRendererComponent> = {
  "photo-gallery.grid": PhotoGalleryGridBlock,
  "photo-gallery.album": PhotoGalleryAlbumBlock,
};
