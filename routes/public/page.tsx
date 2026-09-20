import { notFound } from "next/navigation";
import { isPluginActive } from "@venore/plugin-sdk";
import { listPublicGalleries } from "../../index";
import { GalleryPublicGrid } from "./gallery-public-grid";

// Sem gate de autenticação de propósito — mesmo padrão dos outros públicos do Portal do
// Colaborador (venore-plugin-vagas, venore-plugin-calendar): só o plugin ativo importa.
export default async function PhotoGalleryPublicPage() {
  if (!(await isPluginActive("photo-gallery"))) {
    notFound();
  }

  const result = await listPublicGalleries();
  const galleries = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Galeria de fotos</h1>
        <p className="text-sm text-muted-foreground">Eventos e momentos da comunidade FEM.</p>
      </div>
      <GalleryPublicGrid galleries={galleries} />
    </div>
  );
}
