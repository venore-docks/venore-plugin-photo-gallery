// Mensagem do toast depois de vincular fotos — puro, testável.
export function summarizeAttach(input: { attachedCount: number; alreadyInGallery: number; rejectedCount: number }): string {
  const parts: string[] = [];
  parts.push(input.attachedCount === 1 ? "1 foto adicionada" : `${input.attachedCount} fotos adicionadas`);
  if (input.alreadyInGallery > 0) parts.push(`${input.alreadyInGallery} já estava(m) na galeria`);
  if (input.rejectedCount > 0) parts.push(`${input.rejectedCount} ignorada(s) (não é imagem ou sem acesso)`);
  return `${parts.join(" · ")}.`;
}
