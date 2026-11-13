import { beforeEach, describe, expect, it, vi } from "vitest";

const getMediaAssetUrls = vi.fn();

vi.mock("@venore/plugin-sdk/media", () => ({
  getMediaAssetUrls: (...args: unknown[]) => getMediaAssetUrls(...args),
}));

describe("loadMediaUrls", () => {
  beforeEach(() => {
    getMediaAssetUrls.mockReset();
    getMediaAssetUrls.mockImplementation(async ({ ids }: { ids: string[] }) => ({
      success: true,
      data: Object.fromEntries(ids.filter((id) => !id.startsWith("hidden")).map((id) => [id, `https://cdn/${id}`])),
    }));
  });

  it("não consulta o MMS sem ids", async () => {
    const { loadMediaUrls } = await import("./media-urls");
    expect(await loadMediaUrls([])).toEqual({});
    expect(getMediaAssetUrls).not.toHaveBeenCalled();
  });

  it("deduplica e divide em lotes de 200, repassando a largura de exibição", async () => {
    const { loadMediaUrls } = await import("./media-urls");
    const ids = Array.from({ length: 450 }, (_, i) => `m${i}`);
    const urls = await loadMediaUrls([...ids, "m0", "m1"], 240);

    expect(getMediaAssetUrls).toHaveBeenCalledTimes(3);
    expect(getMediaAssetUrls.mock.calls.map(([query]) => query.ids.length)).toEqual([200, 200, 50]);
    expect(getMediaAssetUrls.mock.calls.every(([query]) => query.displayWidth === 240)).toBe(true);
    expect(Object.keys(urls)).toHaveLength(450);
  });

  it("asset que o MMS não devolve (sem acesso/apagado) simplesmente fica de fora", async () => {
    const { loadMediaUrls } = await import("./media-urls");
    expect(await loadMediaUrls(["a", "hidden-b"])).toEqual({ a: "https://cdn/a" });
  });

  it("lote que falha não derruba os outros", async () => {
    getMediaAssetUrls.mockResolvedValueOnce({ success: false, error: { code: "x", message: "x" } });
    const { loadMediaUrls } = await import("./media-urls");
    const ids = Array.from({ length: 201 }, (_, i) => `m${i}`);
    const urls = await loadMediaUrls(ids);
    expect(Object.keys(urls)).toEqual(["m200"]);
  });
});
