import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlockRendererProps } from "@venore/plugin-sdk";
import { GalleryLightboxClient, PLAIN_CARD_CLASSES, type GalleryMuralItem } from "@venore/plugin-sdk/ui";
import { formatPhotoCount } from "../shared/format";
import { loadPublicGallery } from "../routes/public/load-gallery";

const LIMIT_MAX = 200;

function readString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value.trim() : "";
}

function readLimit(data: Record<string, unknown>): number {
  const value = Number(data.limit);
  return Number.isFinite(value) && value > 0 ? Math.min(Math.trunc(value), LIMIT_MAX) : LIMIT_MAX;
}

// Fotos de uma galeria publicada, com o mesmo lightbox de /galerias/<slug> (teclado, swipe, foco).
// Mesma leitura pública da página (loadPublicGallery, deduplicada por request): só galeria
// publicada, e cada foto já vem filtrada pela visibilidade do MMS.
export async function PhotoGalleryAlbumBlock({ block, mode }: BlockRendererProps) {
  const slug = readString(block.data, "gallerySlug");
  const title = readString(block.data, "title");
  const showAllLink = block.data.showAllLink !== false;

  const result = slug ? await loadPublicGallery(slug) : null;
  const gallery = result?.success ? result.data : null;
  if (!gallery) {
    // Editor: diz por que está vazio; publicado: o bloco some.
    if (mode !== "edit") return null;
    return (
      <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        {slug ? `Galeria "${slug}" não encontrada ou não publicada.` : "Informe o slug da galeria."}
      </p>
    );
  }

  const photos = gallery.photos.slice(0, readLimit(block.data));
  const items: GalleryMuralItem[] = photos.map((photo, index) => ({
    id: photo.id,
    thumbUrl: photo.thumbUrl,
    fullUrl: photo.fullUrl,
    alt: photo.caption || `${gallery.title} — foto ${index + 1} de ${gallery.photos.length}`,
    caption: "",
  }));
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      {(title || showAllLink) && (
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
          {showAllLink && (
            <Link
              href={`/galerias/${gallery.slug}`}
              className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Abrir a galeria ({formatPhotoCount(gallery.photos.length)})
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      )}
      <GalleryLightboxClient
        items={items}
        gridClassName="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3"
        cardClassName={PLAIN_CARD_CLASSES}
        aspectClass="aspect-square"
        htmlId={block.htmlId ?? null}
      />
    </section>
  );
}
