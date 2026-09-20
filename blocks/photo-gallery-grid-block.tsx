import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { listPublicGalleriesHandler as listPublicGalleries } from "../features/list-public-galleries/handler";
import type { BlockRendererProps } from "@venore/plugin-sdk";
import { hasRichTextContent, renderRichTextContent, RICH_TEXT_INLINE_CLASSES } from "@venore/plugin-sdk/page-builder";
import { cn } from "@venore/plugin-sdk/ui";

function readString(data: Record<string, unknown>, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readLimit(data: Record<string, unknown>, fallback: number): number {
  const value = data.limit;
  return typeof value === "number" && value > 0 ? value : fallback;
}

// Grade de galerias publicadas — mesmo padrão de leitura pública sem auth de
// VagasOpenPositionsBlock/CalendarUpcomingEventsBlock.
export async function PhotoGalleryGridBlock({ block }: BlockRendererProps) {
  const title = readString(block.data, "title", "Galeria de fotos");
  const description = block.data.description;
  const emptyMessage = hasRichTextContent(block.data.emptyMessage)
    ? block.data.emptyMessage
    : "Nenhuma galeria publicada no momento.";
  const limit = readLimit(block.data, 6);

  const result = await listPublicGalleries();
  if (!result.success) {
    return null;
  }

  const galleries = result.data.slice(0, limit);

  return (
    <div className="rounded-panel border border-border bg-card p-4 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {hasRichTextContent(description) && (
          <div className={cn("mt-1 text-sm text-muted-foreground", RICH_TEXT_INLINE_CLASSES)}>{renderRichTextContent(description)}</div>
        )}
      </div>

      {galleries.length === 0 ? (
        <div className={cn("mt-4 text-sm text-muted-foreground", RICH_TEXT_INLINE_CLASSES)}>{renderRichTextContent(emptyMessage)}</div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              href={`/galerias/${gallery.slug}`}
              className="group overflow-hidden rounded-panel border border-border bg-muted"
            >
              <div className="relative aspect-square">
                {gallery.coverMediaUrl ? (
                  <Image
                    src={gallery.coverMediaUrl}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-6" />
                  </div>
                )}
              </div>
              <p className="truncate p-2 text-xs font-medium text-foreground">{gallery.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
