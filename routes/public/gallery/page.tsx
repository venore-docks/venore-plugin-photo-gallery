import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { isPluginActive } from "@venore/plugin-sdk";
import { getGalleryBySlug } from "../../../index";

export const dynamic = "force-dynamic";

export default async function PhotoGalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isPluginActive("photo-gallery"))) {
    notFound();
  }

  const { slug } = await params;
  const result = await getGalleryBySlug({ slug });
  if (!result.success || !result.data) {
    notFound();
  }

  const gallery = result.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-10">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/galerias">
          <ArrowLeft className="size-4" />
          Voltar para galerias
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{gallery.title}</h1>
        {gallery.category && <p className="text-sm text-muted-foreground">{gallery.category}</p>}
        {gallery.description && <p className="mt-2 text-sm text-foreground">{gallery.description}</p>}
      </div>

      {gallery.photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Esta galeria ainda não tem fotos.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-panel border border-border bg-muted">
              <Image src={photo.url} alt={photo.caption ?? gallery.title} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
