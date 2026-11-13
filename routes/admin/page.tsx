import { Images } from "lucide-react";
import { listGalleries } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, EmptyState } from "@venore/plugin-sdk/ui";
import { CreateGalleryDialog } from "./create-gallery-dialog";
import { GalleryTable } from "./gallery-table";

export default async function PhotoGalleryAdminPage() {
  const gate = await getPluginAdminPageData("photo-gallery");

  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver as galerias de fotos." />;
  }

  const result = await listGalleries();
  if (!result.success) {
    return <p className="text-sm text-destructive">Erro ao carregar galerias: {result.error.message}</p>;
  }

  const galleries = result.data;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Galeria de fotos"
        description="Galerias publicadas aparecem em /galerias. As fotos ficam na biblioteca de mídia e podem ser reaproveitadas."
        actions={galleries.length > 0 && <CreateGalleryDialog />}
      />

      {galleries.length === 0 ? (
        <EmptyState
          icon={<Images className="size-8" strokeWidth={1.5} />}
          title="Nenhuma galeria cadastrada"
          description="Cadastre a primeira galeria para começar a publicar fotos."
          action={<CreateGalleryDialog />}
        />
      ) : (
        <div className="rounded-panel border border-border bg-card">
          <GalleryTable galleries={galleries} />
        </div>
      )}
    </div>
  );
}
