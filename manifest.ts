import type { PluginManifest } from "@venore/plugin-sdk";

// Faixa escrita à mão, mesmo motivo dos outros manifests do Portal do Colaborador
// (venore-plugin-vagas/manifest.ts, venore-plugin-calendar/manifest.ts).
export const photoGalleryManifest: PluginManifest = {
  manifestVersion: "1.0.0",
  key: "photo-gallery",
  name: "Galeria de fotos",
  version: "1.0.0",
  description: "Galerias de fotos por categoria, com upload direto e listagem pública.",
  compatibility: { coreVersion: ">=2.0.0 <3.0.0" },
  // Schema próprio do plugin — aplicado no install (run-plugin-migrations.ts), não no
  // vercel-build. Default de migrationsSchema ("photo_gallery_migrations") já bate com
  // venore-plugin-photo-gallery/drizzle.config.ts.
  migrationsPath: "./migrations",
  permissions: [
    { key: "photo-gallery.read", label: "Ver galerias de fotos" },
    { key: "photo-gallery.manage", label: "Cadastrar, editar e remover galerias e fotos" },
  ],
  navigation: [
    {
      key: "photo-gallery.admin",
      label: "Galeria de fotos",
      href: "/admin/photo-gallery",
      icon: "image",
      groupKey: "plugins",
      groupLabel: "Plugins",
      groupOrder: 30,
      order: 50,
      requiredPermission: "photo-gallery.read",
    },
  ],
  seeds: [],
  blocks: [{ key: "photo-gallery.grid", label: "Galeria de fotos — Grade de galerias" }],
};
