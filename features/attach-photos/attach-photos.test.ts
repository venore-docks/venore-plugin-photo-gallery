import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@venore/plugin-sdk/observability", () => ({
  beginOperation: vi.fn(() => ({ operationId: "op-1" })),
  endOperation: vi.fn(),
}));

const getMediaAsset = vi.fn();
vi.mock("@venore/plugin-sdk/media", () => ({
  getMediaAsset: (...args: unknown[]) => getMediaAsset(...args),
}));

const authorizeActor = vi.fn();
vi.mock("@venore/plugin-sdk/rbac", () => ({
  authorizeActor: (...args: unknown[]) => authorizeActor(...args),
}));

const appendPhotosToGallery = vi.fn();
vi.mock("./store", () => ({
  appendPhotosToGallery: (...args: unknown[]) => appendPhotosToGallery(...args),
}));

const ASSETS: Record<string, { contentType: string }> = {
  img1: { contentType: "image/jpeg" },
  img2: { contentType: "image/webp" },
  pdf: { contentType: "application/pdf" },
};

describe("attachPhotos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMediaAsset.mockImplementation(async ({ id }: { id: string }) => ({ success: true, data: ASSETS[id] ?? null }));
    authorizeActor.mockResolvedValue({ authorized: true, actorId: "actor-1" });
    appendPhotosToGallery.mockImplementation(async (_galleryId: string, ids: string[]) => ({
      inserted: ids.map((mediaId, order) => ({ id: `p-${mediaId}`, mediaId, order })),
      alreadyInGallery: 0,
    }));
  });

  it("vincula só imagens que o MMS devolve; o resto volta como rejeitado", async () => {
    const { attachPhotos } = await import("./service");
    const result = await attachPhotos({ galleryId: "g1", mediaIds: ["img1", "pdf", "missing", "img2"], actorId: "actor-1" });

    expect(appendPhotosToGallery).toHaveBeenCalledWith("g1", ["img1", "img2"]);
    expect(result.success && result.data.rejectedMediaIds).toEqual(["pdf", "missing"]);
    expect(result.success && result.data.attached).toHaveLength(2);
  });

  it("nada aproveitável = erro, sem tocar no banco", async () => {
    const { attachPhotos } = await import("./service");
    const result = await attachPhotos({ galleryId: "g1", mediaIds: ["pdf"], actorId: "actor-1" });

    expect(result.success).toBe(false);
    expect(appendPhotosToGallery).not.toHaveBeenCalled();
  });

  it("galeria inexistente vira not_found (não erro de FK)", async () => {
    appendPhotosToGallery.mockResolvedValue(null);
    const { attachPhotos } = await import("./service");
    const result = await attachPhotos({ galleryId: "nope", mediaIds: ["img1"], actorId: "actor-1" });

    expect(result).toEqual({ success: false, error: expect.objectContaining({ code: "photo-gallery.not_found" }) });
  });

  it("handler: valida e deduplica antes de autorizar; sem permissão não chama o service", async () => {
    const { attachPhotosHandler } = await import("./handler");

    expect((await attachPhotosHandler({ galleryId: "g1", mediaIds: [" ", ""] })).success).toBe(false);
    expect(authorizeActor).not.toHaveBeenCalled();

    authorizeActor.mockResolvedValueOnce({ authorized: false, error: { code: "rbac.authorization.forbidden", message: "não" } });
    const denied = await attachPhotosHandler({ galleryId: "g1", mediaIds: ["img1"] });
    expect(denied).toEqual({ success: false, error: expect.objectContaining({ code: "rbac.authorization.forbidden" }) });
    expect(authorizeActor).toHaveBeenCalledWith("photo-gallery.manage");
    expect(getMediaAsset).not.toHaveBeenCalled();

    await attachPhotosHandler({ galleryId: "g1", mediaIds: ["img1", "img1", "img2"] });
    expect(appendPhotosToGallery).toHaveBeenCalledWith("g1", ["img1", "img2"]);
  });
});
