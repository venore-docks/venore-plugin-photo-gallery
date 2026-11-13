import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Badge, Button } from "@venore/plugin-sdk/ui";
import { getGallery, listGalleryPhotos } from "../../../index";
import { formatEventDate } from "../../../shared/format";
import { AddPhotosPanel } from "../add-photos-panel";
import { PhotoManager } from "../photo-manager";
import { EditGalleryDialog } from "../edit-gallery-dialog";
import { DeleteGalleryButton } from "../delete-gallery-button";

export const dynamic = "force-dynamic";

export default async function PhotoGalleryDetailAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const gate = await getPluginAdminPageData("photo-gallery");
  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para gerenciar fotos." />;
  }

  const { id } = await params;
  const [galleryResult, photosResult] = await Promise.all([getGallery({ galleryId: id }), listGalleryPhotos({ galleryId: id })]);

  if (!galleryResult.success || !photosResult.success) {
    return <p className="text-sm text-destructive">Erro ao carregar a galeria.</p>;
  }

  const gallery = galleryResult.data;
  if (!gallery) {
    notFound();
  }

  const photos = photosResult.data;
  const subtitle = [gallery.category, gallery.eventDate ? formatEventDate(gallery.eventDate) : null].filter(Boolean).join(" · ");

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/photo-gallery">
          <ArrowLeft className="size-4" />
          Voltar para galerias
        </Link>
      </Button>

      <AdminPageHeader
        title={gallery.title}
        description={subtitle || "Envie fotos, escolha a capa e organize a ordem da galeria."}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={gallery.status === "published" ? "default" : "secondary"}>
              {gallery.status === "published" ? "Publicada" : "Rascunho"}
            </Badge>
            {gallery.status === "published" && (
              <Button variant="outline" asChild>
                <Link href={`/galerias/${gallery.slug}`} target="_blank">
                  <ExternalLink className="size-4" />
                  Ver página
                </Link>
              </Button>
            )}
            <EditGalleryDialog gallery={gallery} withLabel />
            <DeleteGalleryButton galleryId={gallery.id} title={gallery.title} redirectToList />
          </div>
        }
      />

      <AddPhotosPanel galleryId={gallery.id} mediaIdsInGallery={photos.map((photo) => photo.mediaId)} />
      <PhotoManager galleryId={gallery.id} photos={photos} coverPhotoId={gallery.coverPhotoId} />
    </div>
  );
}
