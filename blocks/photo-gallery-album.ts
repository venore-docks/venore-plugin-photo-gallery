import type { BlockDefinition } from "@venore/plugin-sdk/cms";

// Fotos de UMA galeria dentro de uma página/notícia (o photo-gallery.grid lista galerias, não
// fotos). A galeria é escolhida pelo slug — o mesmo de /galerias/<slug>.
export const photoGalleryAlbumBlockDefinition: BlockDefinition = {
  key: "photo-gallery.album",
  label: "Galeria de fotos — Fotos de uma galeria",
  category: "photo-gallery",
  structure: "leaf",
  allowedInRoot: true,
  defaultData: {
    gallerySlug: "",
    title: "",
    limit: 0,
    showAllLink: true,
  },
  editorFields: [
    { name: "gallerySlug", type: "text", label: "Slug da galeria (o final de /galerias/…)" },
    { name: "title", type: "text", label: "Título (opcional — vazio não mostra título)" },
    { name: "limit", type: "number", label: "Quantidade máxima de fotos (0 = todas)" },
    { name: "showAllLink", type: "boolean", label: "Mostrar link “Abrir a galeria”" },
  ],
};
