import Link from "next/link";
import { ImageOff } from "lucide-react";
import { cn } from "@venore/plugin-sdk/ui";
import type { PublicGalleryView } from "../features/list-public-galleries/types";
import { formatEventDate, formatPhotoCount } from "../shared/format";

// Cards de galeria — mesmos na página /galerias e no bloco de página (photo-gallery.grid).
// <img> com a variante pequena do MMS, não next/image: o core não configura domínio remoto pro
// otimizador (mesma escolha de core.content.image e do mural de core.layout.gallery).
export function GalleryCardGrid({ galleries, className }: { galleries: PublicGalleryView[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4", className)}>
      {galleries.map((gallery) => {
        const meta = [gallery.eventDate ? formatEventDate(gallery.eventDate) : null, formatPhotoCount(gallery.photoCount)]
          .filter(Boolean)
          .join(" · ");
        return (
          <li key={gallery.id}>
            <Link
              href={`/galerias/${gallery.slug}`}
              className="group block overflow-hidden rounded-panel border border-border bg-card outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {gallery.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- ver comentário do componente
                  <img
                    src={gallery.coverUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-6" aria-hidden />
                  </div>
                )}
              </div>
              <div className="space-y-0.5 p-2 sm:p-3">
                <p className="line-clamp-2 text-sm font-medium text-foreground">{gallery.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {gallery.category ? `${gallery.category} · ${meta}` : meta}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
