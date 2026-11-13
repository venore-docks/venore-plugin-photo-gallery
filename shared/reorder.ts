// Movimentos de ordem da grade do admin — puro (usado no client pra montar a ordem nova que vai
// pro reorder-photos, e testável sem React).
export type PhotoMove = "first" | "previous" | "next" | "last";

export function movePhotoId(ids: readonly string[], photoId: string, move: PhotoMove): string[] {
  const index = ids.indexOf(photoId);
  if (index === -1) return [...ids];

  const target =
    move === "first" ? 0 : move === "last" ? ids.length - 1 : move === "previous" ? Math.max(index - 1, 0) : Math.min(index + 1, ids.length - 1);
  if (target === index) return [...ids];

  const next = [...ids];
  next.splice(index, 1);
  next.splice(target, 0, photoId);
  return next;
}

// A ordem pedida tem que ser uma permutação exata das fotos atuais — senão alguém reordenou com
// a tela desatualizada (foto adicionada/removida em outra aba) e gravar apagaria essa mudança.
export function isPermutationOf(requested: readonly string[], current: readonly string[]): boolean {
  if (requested.length !== current.length) return false;
  const currentSet = new Set(current);
  const requestedSet = new Set(requested);
  return requestedSet.size === requested.length && requested.every((id) => currentSet.has(id));
}
