import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@venore/plugin-sdk/observability", () => ({
  beginOperation: vi.fn(() => ({ operationId: "op-1" })),
  endOperation: vi.fn(),
}));

const findGalleryById = vi.fn();
const applyGalleryUpdate = vi.fn();
vi.mock("./store", () => ({
  findGalleryById: (...args: unknown[]) => findGalleryById(...args),
  applyGalleryUpdate: (...args: unknown[]) => applyGalleryUpdate(...args),
}));

const baseCommand = { galleryId: "g1", title: " Festa ", category: "", eventDate: "2026-06-14", actorId: "actor-1" };

describe("updateGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    applyGalleryUpdate.mockImplementation(async (input: unknown) => input);
  });

  it("mantém a primeira data de publicação ao voltar de rascunho", async () => {
    const firstPublished = new Date("2026-01-01T00:00:00Z");
    findGalleryById.mockResolvedValue({ id: "g1", publishedAt: firstPublished });
    const { updateGallery } = await import("./service");

    await updateGallery({ ...baseCommand, status: "published" });

    expect(applyGalleryUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Festa", category: null, eventDate: "2026-06-14", publishedAt: firstPublished }),
    );
  });

  it("preenche publishedAt na primeira publicação", async () => {
    findGalleryById.mockResolvedValue({ id: "g1", publishedAt: null });
    const { updateGallery } = await import("./service");

    await updateGallery({ ...baseCommand, status: "published" });

    expect(applyGalleryUpdate.mock.calls[0][0].publishedAt).toBeInstanceOf(Date);
  });

  it("galeria inexistente = not_found sem gravar", async () => {
    findGalleryById.mockResolvedValue(null);
    const { updateGallery } = await import("./service");

    const result = await updateGallery({ ...baseCommand, status: "draft" });

    expect(result.success).toBe(false);
    expect(applyGalleryUpdate).not.toHaveBeenCalled();
  });
});
