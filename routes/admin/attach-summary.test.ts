import { describe, expect, it } from "vitest";
import { summarizeAttach } from "./attach-summary";

describe("summarizeAttach", () => {
  it("resume o que entrou, o que já estava e o que foi ignorado", () => {
    expect(summarizeAttach({ attachedCount: 1, alreadyInGallery: 0, rejectedCount: 0 })).toBe("1 foto adicionada.");
    expect(summarizeAttach({ attachedCount: 3, alreadyInGallery: 2, rejectedCount: 1 })).toBe(
      "3 fotos adicionadas · 2 já estava(m) na galeria · 1 ignorada(s) (não é imagem ou sem acesso).",
    );
  });
});
