import type { BlockDefinition } from "@venore/plugin-sdk/cms";
import { photoGalleryAlbumBlockDefinition } from "./photo-gallery-album";
import { photoGalleryGridBlockDefinition } from "./photo-gallery-grid";

export const blockDefinitions: BlockDefinition[] = [photoGalleryGridBlockDefinition, photoGalleryAlbumBlockDefinition];
