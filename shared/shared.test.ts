import { describe, expect, it } from "vitest";
import { generateGallerySlug } from "./generate-slug";
import { isValidEventDate, normalizeGalleryFields, uniqueIds, validateGalleryFields, validateIdBatch } from "./validation";
import { isPermutationOf, movePhotoId } from "./reorder";
import { formatEventDate, formatPhotoCount } from "./format";

describe("generateGallerySlug", () => {
  it("remove acento sem levar a letra", () => {
    expect(generateGallerySlug("Formatura Ação Social")).toBe("formatura-acao-social");
    expect(generateGallerySlug("Coração & Integração")).toBe("coracao-integracao");
  });

  it("junta qualquer sequência de pontuação/espaço num hífen só", () => {
    expect(generateGallerySlug("Festa - 2026")).toBe("festa-2026");
    expect(generateGallerySlug("Jun.2026/Edição 1")).toBe("jun-2026-edicao-1");
    expect(generateGallerySlug("  --Olá!--  ")).toBe("ola");
  });

  it("devolve vazio quando não sobra nada (o store cai em 'galeria')", () => {
    expect(generateGallerySlug("!!!")).toBe("");
  });

  it("limita o tamanho sem terminar em hífen", () => {
    const slug = generateGallerySlug(`${"a".repeat(79)} b`);
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("validateGalleryFields", () => {
  it("exige título", () => {
    expect(validateGalleryFields({ title: "   " })?.code).toBe("photo-gallery.invalid_title");
  });

  it("aceita data de calendário real e recusa data impossível", () => {
    expect(isValidEventDate("2026-02-28")).toBe(true);
    expect(isValidEventDate("2024-02-29")).toBe(true);
    expect(isValidEventDate("2026-02-30")).toBe(false);
    expect(isValidEventDate("14/06/2026")).toBe(false);
    expect(validateGalleryFields({ title: "Festa", eventDate: "2026-13-01" })?.code).toBe("photo-gallery.invalid_event_date");
    expect(validateGalleryFields({ title: "Festa", eventDate: "" })).toBeNull();
  });

  it("normaliza opcionais vazios para null", () => {
    expect(normalizeGalleryFields({ title: " Festa ", category: " ", description: "", eventDate: " 2026-06-14 " })).toEqual({
      title: "Festa",
      category: null,
      description: null,
      eventDate: "2026-06-14",
    });
  });
});

describe("lotes de ids", () => {
  it("remove vazios e repetidos mantendo a ordem", () => {
    expect(uniqueIds(["b", " a ", "", "b", "c"])).toEqual(["b", "a", "c"]);
  });

  it("recusa lote vazio ou acima do teto", () => {
    expect(validateIdBatch([], "foto")?.code).toBe("photo-gallery.empty_batch");
    expect(validateIdBatch(Array.from({ length: 201 }, (_, i) => `${i}`), "foto")?.code).toBe("photo-gallery.batch_too_large");
    expect(validateIdBatch(["a"], "foto")).toBeNull();
  });
});

describe("movePhotoId", () => {
  const ids = ["a", "b", "c", "d"];

  it("move para início, fim e uma posição", () => {
    expect(movePhotoId(ids, "c", "first")).toEqual(["c", "a", "b", "d"]);
    expect(movePhotoId(ids, "b", "last")).toEqual(["a", "c", "d", "b"]);
    expect(movePhotoId(ids, "c", "previous")).toEqual(["a", "c", "b", "d"]);
    expect(movePhotoId(ids, "b", "next")).toEqual(["a", "c", "b", "d"]);
  });

  it("não sai das bordas nem muda com id desconhecido", () => {
    expect(movePhotoId(ids, "a", "previous")).toEqual(ids);
    expect(movePhotoId(ids, "d", "next")).toEqual(ids);
    expect(movePhotoId(ids, "x", "first")).toEqual(ids);
  });
});

describe("isPermutationOf", () => {
  it("só aceita exatamente as mesmas fotos", () => {
    expect(isPermutationOf(["b", "a"], ["a", "b"])).toBe(true);
    expect(isPermutationOf(["a"], ["a", "b"])).toBe(false);
    expect(isPermutationOf(["a", "a"], ["a", "b"])).toBe(false);
    expect(isPermutationOf(["a", "c"], ["a", "b"])).toBe(false);
  });
});

describe("format", () => {
  it("formata data sem deslocar fuso e pluraliza fotos", () => {
    expect(formatEventDate("2026-06-01")).toBe("01/06/2026");
    expect(formatPhotoCount(1)).toBe("1 foto");
    expect(formatPhotoCount(0)).toBe("0 fotos");
  });
});
