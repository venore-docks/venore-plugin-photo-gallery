import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listPublicGalleriesHandler as listPublicGalleries } from "../features/list-public-galleries/handler";
import type { BlockRendererProps } from "@venore/plugin-sdk";
import { hasRichTextContent, renderRichTextContent, RICH_TEXT_INLINE_CLASSES } from "@venore/plugin-sdk/page-builder";
import { cn } from "@venore/plugin-sdk/ui";
import { GalleryCardGrid } from "../components/gallery-card-grid";

const LIMIT_MAX = 24;

function readString(data: Record<string, unknown>, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readLimit(data: Record<string, unknown>, fallback: number): number {
  const value = Number(data.limit);
  return Number.isFinite(value) && value > 0 ? Math.min(Math.trunc(value), LIMIT_MAX) : fallback;
}

// Grade de galerias publicadas — mesmo padrão de leitura pública de
// VagasOpenPositionsBlock/CalendarUpcomingEventsBlock. Limite e categoria vão pra consulta (não
// busca tudo pra cortar depois).
export async function PhotoGalleryGridBlock({ block }: BlockRendererProps) {
  const title = readString(block.data, "title", "Galeria de fotos");
  const description = block.data.description;
  const emptyMessage = hasRichTextContent(block.data.emptyMessage)
    ? block.data.emptyMessage
    : "Nenhuma galeria publicada no momento.";
  const category = readString(block.data, "category", "");
  const showAllLink = block.data.showAllLink !== false;

  const result = await listPublicGalleries({ category: category || null, limit: readLimit(block.data, 6) });
  if (!result.success) {
    return null;
  }

  const galleries = result.data;

  return (
    <div className="rounded-panel border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {hasRichTextContent(description) && (
            <div className={cn("mt-1 text-sm text-muted-foreground", RICH_TEXT_INLINE_CLASSES)}>{renderRichTextContent(description)}</div>
          )}
        </div>
        {showAllLink && galleries.length > 0 && (
          <Link
            href="/galerias"
            className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Ver todas
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>

      {galleries.length === 0 ? (
        <div className={cn("mt-4 text-sm text-muted-foreground", RICH_TEXT_INLINE_CLASSES)}>{renderRichTextContent(emptyMessage)}</div>
      ) : (
        <GalleryCardGrid galleries={galleries} className="mt-4" />
      )}
    </div>
  );
}
