import { beforeEach, describe, expect, it, vi } from "vitest";

const loadMediaUrls = vi.fn();
vi.mock("../../shared/media-urls", () => ({
  THUMB_DISPLAY_WIDTH: 240,
  FULL_DISPLAY_WIDTH: 960,
  loadMediaUrls: (...args: unknown[]) => loadMediaUrls(...args),
}));

const findPublishedGalleryBySlug = vi.fn();
const findPhotosByGalleryId = vi.fn();
vi.mock("./store", () => ({
  findPublishedGalleryBySlug: (...args: unknown[]) => findPublishedGalleryBySlug(...args),
  findPhotosByGalleryId: (...args: unknown[]) => findPhotosByGalleryId(...args),
}));

describe("getGalleryBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findPublishedGalleryBySlug.mockResolvedValue({
      id: "g1",
      title: "Festa",
      slug: "festa",
      category: null,
      description: null,
      eventDate: "2026-06-14",
      publishedAt: null,
    });
    findPhotosByGalleryId.mockResolvedValue([
      { id: "p1", mediaId: "m1", caption: "Abertura" },
      { id: "p2", mediaId: "m2", caption: null },
      { id: "p3", mediaId: "m3", caption: null },
    ]);
    loadMediaUrls.mockImplementation(async (ids: string[], width: number) =>
      Object.fromEntries(ids.filter((id) => id !== "m2").map((id) => [id, `${id}@${width}`])),
    );
  });

  it("resolve miniatura e ampliada em dois lotes e descarta foto que o MMS não devolve", async () => {
    const { getGalleryBySlug } = await import("./service");
    const result = await getGalleryBySlug({ slug: "festa" });

    expect(loadMediaUrls).toHaveBeenCalledTimes(2);
    expect(result.success && result.data?.photos).toEqual([
      { id: "p1", thumbUrl: "m1@240", fullUrl: "m1@960", caption: "Abertura" },
      { id: "p3", thumbUrl: "m3@240", fullUrl: "m3@960", caption: null },
    ]);
  });

  it("slug vazio ou galeria não publicada = null, sem consultar fotos", async () => {
    const { getGalleryBySlug } = await import("./service");
    expect(await getGalleryBySlug({ slug: "  " })).toEqual({ success: true, data: null });

    findPublishedGalleryBySlug.mockResolvedValue(null);
    expect(await getGalleryBySlug({ slug: "rascunho" })).toEqual({ success: true, data: null });
    expect(findPhotosByGalleryId).not.toHaveBeenCalled();
  });
});
