// Slug determinístico a partir do título — mesmo helper de venore-plugin-vagas/shared/generate-slug.ts.
export function generateGallerySlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}
