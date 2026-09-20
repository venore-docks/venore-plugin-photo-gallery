import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { PublicGalleryView } from "../../index";

export function GalleryPublicGrid({ galleries }: { galleries: PublicGalleryView[] }) {
  if (galleries.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma galeria publicada no momento.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {galleries.map((gallery) => (
        <Link
          key={gallery.id}
          href={`/galerias/${gallery.slug}`}
          className="group overflow-hidden rounded-panel border border-border bg-muted"
        >
          <div className="relative aspect-square">
            {gallery.coverMediaUrl ? (
              <Image src={gallery.coverMediaUrl} alt={gallery.title} fill className="object-cover transition-transform group-hover:scale-105" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <ImageOff className="size-6" />
              </div>
            )}
          </div>
          <div className="p-2">
            <p className="truncate text-sm font-medium text-foreground">{gallery.title}</p>
            {gallery.category && <p className="truncate text-xs text-muted-foreground">{gallery.category}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
