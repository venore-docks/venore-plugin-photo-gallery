import type { PluginContributions } from "@venore/plugin-sdk";
import { photoGalleryBreadcrumbSegments } from "./breadcrumbs";
import { blockDefinitions } from "./blocks/definitions";

// Mesmo padrão de venore-plugin-birthdays/contributions.ts. Sem seeds — galeria de fotos precisa
// de upload real de imagem, não faz sentido um seed de "dados de exemplo" sintético aqui.
export const photoGalleryContributions: PluginContributions = {
  breadcrumbSegments: photoGalleryBreadcrumbSegments,
  blockDefinitions,
  blockRenderers: async () => (await import("./blocks/renderers")).blockRenderers,
};
