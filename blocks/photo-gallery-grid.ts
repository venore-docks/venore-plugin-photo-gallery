import type { BlockDefinition } from "@venore/plugin-sdk/cms";

export const photoGalleryGridBlockDefinition: BlockDefinition = {
  key: "photo-gallery.grid",
  label: "Galeria de fotos — Grade de galerias",
  category: "photo-gallery",
  structure: "leaf",
  allowedInRoot: true,
  defaultData: {
    title: "Galeria de fotos",
    description: "",
    emptyMessage: "Nenhuma galeria publicada no momento.",
    limit: 6,
  },
  editorFields: [
    { name: "title", type: "text", label: "Título" },
    { name: "description", type: "richtext", label: "Descrição (opcional)" },
    { name: "emptyMessage", type: "richtext", label: "Mensagem quando não há galerias" },
    { name: "limit", type: "number", label: "Quantidade máxima exibida" },
  ],
};
