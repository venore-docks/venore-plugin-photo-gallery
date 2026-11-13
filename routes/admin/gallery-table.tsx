import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@venore/plugin-sdk/ui";
import { Badge } from "@venore/plugin-sdk/ui";
import type { GalleryAdminSummary } from "../../index";
import { formatEventDate } from "../../shared/format";
import { EditGalleryDialog } from "./edit-gallery-dialog";
import { DeleteGalleryButton } from "./delete-gallery-button";

const STATUS_LABEL: Record<GalleryAdminSummary["status"], string> = { draft: "Rascunho", published: "Publicada" };

export function GalleryTable({ galleries }: { galleries: GalleryAdminSummary[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Galeria</TableHead>
          <TableHead className="hidden md:table-cell">Data do evento</TableHead>
          <TableHead className="hidden sm:table-cell w-20 text-right">Fotos</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead className="w-24 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {galleries.map((gallery) => (
          <TableRow key={gallery.id}>
            <TableCell>
              <Link
                href={`/admin/photo-gallery/galleries/${gallery.id}`}
                className="flex items-center gap-3 rounded-md outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
                  {gallery.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- URL do MMS (storage remoto, sem next/image configurado no core)
                    <img src={gallery.coverUrl} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <ImageOff className="size-4" aria-hidden />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">{gallery.title}</span>
                  {gallery.category && <span className="block truncate text-xs text-muted-foreground">{gallery.category}</span>}
                </span>
              </Link>
            </TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">
              {gallery.eventDate ? formatEventDate(gallery.eventDate) : "—"}
            </TableCell>
            <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">{gallery.photoCount}</TableCell>
            <TableCell>
              <Badge variant={gallery.status === "published" ? "default" : "secondary"}>{STATUS_LABEL[gallery.status]}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <EditGalleryDialog gallery={gallery} />
                <DeleteGalleryButton galleryId={gallery.id} title={gallery.title} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
