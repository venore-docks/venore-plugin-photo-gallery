import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, GalleryLightboxClient, PLAIN_CARD_CLASSES, type GalleryMuralItem } from "@venore/plugin-sdk/ui";
import { formatEventDate, formatPhotoCount } from "../../../shared/format";
import { loadPublicGallery } from "../load-gallery";

export const dynamic = "force-dynamic";

// Sem checagem de acesso aqui — ver routes/public/page.tsx. Cada foto já vem filtrada pela
// visibilidade do MMS (getMediaAssetUrls).
export default async function PhotoGalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await loadPublicGallery(slug);
  if (!result.success || !result.data) {
    notFound();
  }

  const gallery = result.data;
  // Lightbox do core (core.layout.gallery): teclado, swipe e foco já resolvidos. A legenda vira o
  // título do lightbox (alt); sem legenda, um texto que diz qual foto é.
  const items: GalleryMuralItem[] = gallery.photos.map((photo, index) => ({
    id: photo.id,
    thumbUrl: photo.thumbUrl,
    fullUrl: photo.fullUrl,
    alt: photo.caption || `${gallery.title} — foto ${index + 1} de ${gallery.photos.length}`,
    caption: "",
  }));
  const meta = [gallery.category, gallery.eventDate ? formatEventDate(gallery.eventDate) : null, formatPhotoCount(items.length)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-10">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/galerias">
          <ArrowLeft className="size-4" />
          Voltar para galerias
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{gallery.title}</h1>
        <p className="text-sm text-muted-foreground">{meta}</p>
        {gallery.description && <p className="mt-3 max-w-prose whitespace-pre-line text-sm text-foreground">{gallery.description}</p>}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Esta galeria ainda não tem fotos.</p>
      ) : (
        <GalleryLightboxClient
          items={items}
          gridClassName="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
          cardClassName={PLAIN_CARD_CLASSES}
          aspectClass="aspect-square"
          htmlId={null}
        />
      )}
    </div>
  );
}
