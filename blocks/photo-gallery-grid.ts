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
    category: "",
    limit: 6,
    showAllLink: true,
  },
  editorFields: [
    { name: "title", type: "text", label: "Título" },
    { name: "description", type: "richtext", label: "Descrição (opcional)" },
    { name: "category", type: "text", label: "Só galerias da categoria (opcional, ex.: Eventos)" },
    { name: "limit", type: "number", label: "Quantidade máxima exibida" },
    { name: "showAllLink", type: "boolean", label: "Mostrar link “Ver todas as galerias”" },
    { name: "emptyMessage", type: "richtext", label: "Mensagem quando não há galerias" },
  ],
};
