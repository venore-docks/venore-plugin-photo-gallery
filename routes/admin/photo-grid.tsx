import Image from "next/image";
import type { GalleryPhotoAdminView } from "../../index";
import { DeletePhotoButton } from "./delete-photo-button";

export function PhotoGrid({ photos, galleryId }: { photos: GalleryPhotoAdminView[]; galleryId: string }) {
  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma foto nesta galeria ainda.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative aspect-square overflow-hidden rounded-panel border border-border bg-muted">
          <Image src={photo.url} alt={photo.caption ?? ""} fill className="object-cover" />
          <DeletePhotoButton photoId={photo.id} galleryId={galleryId} />
        </div>
      ))}
    </div>
  );
}
