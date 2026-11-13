import { listPublicGalleries } from "../../index";
import { GalleryCardGrid } from "../../components/gallery-card-grid";

// Sem checagem de acesso aqui: o core só despacha esta rota com o plugin ativo
// (resolvePublicPluginRoute) e aplica "site só para logados" (platform/site-access) antes.
export default async function PhotoGalleryPublicPage() {
  const result = await listPublicGalleries();
  const galleries = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Galeria de fotos</h1>
        <p className="text-sm text-muted-foreground">Eventos e momentos da comunidade.</p>
      </div>
      {galleries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma galeria publicada no momento.</p>
      ) : (
        <GalleryCardGrid galleries={galleries} />
      )}
    </div>
  );
}
