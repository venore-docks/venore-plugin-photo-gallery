import type { BreadcrumbSegmentDefinition } from "@venore/plugin-sdk";
import { staticBreadcrumbSegment } from "@venore/plugin-sdk";

export const photoGalleryBreadcrumbSegments: BreadcrumbSegmentDefinition[] = [
  staticBreadcrumbSegment({ key: "photo-gallery.public", segments: ["galerias"], label: "Galeria de fotos" }),
  staticBreadcrumbSegment({ key: "photo-gallery.admin", segments: ["admin", "photo-gallery"], label: "Galeria de fotos" }),
];
