// Slug determinístico a partir do título. Acento sai sem levar a letra junto ("Ação" -> "acao");
// qualquer sequência de pontuação/espaço vira UM hífen ("Festa - 2026" -> "festa-2026", não
// "festa---2026"), e "Jun.2026" não gruda em "jun2026".
export function generateGallerySlug(title: string): string {
  return title
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
