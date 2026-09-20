import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied } from "@venore/plugin-sdk/ui";
import { AdminPageHeader } from "@venore/plugin-sdk/ui";
import { Button } from "@venore/plugin-sdk/ui";
import { listGalleries, listGalleryPhotos } from "../../../index";
import { UploadPhotosForm } from "../upload-photos-form";
import { PhotoGrid } from "../photo-grid";

export const dynamic = "force-dynamic";

export default async function PhotoGalleryDetailAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const gate = await getPluginAdminPageData("photo-gallery");
  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para gerenciar fotos." />;
  }

  const { id } = await params;

  const [galleriesResult, photosResult] = await Promise.all([listGalleries(), listGalleryPhotos({ galleryId: id })]);

  if (!galleriesResult.success || !photosResult.success) {
    return <p className="text-sm text-destructive">Erro ao carregar a galeria.</p>;
  }

  const gallery = galleriesResult.data.find((item) => item.id === id);
  if (!gallery) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/photo-gallery">
          <ArrowLeft className="size-4" />
          Voltar para galerias
        </Link>
      </Button>

      <AdminPageHeader title={gallery.title} description="Envie fotos e organize o que aparece nesta galeria." />

      <UploadPhotosForm galleryId={gallery.id} />
      <PhotoGrid photos={photosResult.data} galleryId={gallery.id} />
    </div>
  );
}
