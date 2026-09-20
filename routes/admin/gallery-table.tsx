import Link from "next/link";
import { Images } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@venore/plugin-sdk/ui";
import { Badge } from "@venore/plugin-sdk/ui";
import { Button } from "@venore/plugin-sdk/ui";
import type { GalleryRecord } from "../../index";
import { EditGalleryDialog } from "./edit-gallery-dialog";
import { DeleteGalleryButton } from "./delete-gallery-button";

const STATUS_LABEL: Record<GalleryRecord["status"], string> = { draft: "Rascunho", published: "Publicada" };

export function GalleryTable({ galleries }: { galleries: GalleryRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead className="hidden sm:table-cell">Categoria</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead className="w-40 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {galleries.map((gallery) => (
          <TableRow key={gallery.id}>
            <TableCell className="font-medium text-foreground">{gallery.title}</TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">{gallery.category ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={gallery.status === "published" ? "default" : "secondary"}>{STATUS_LABEL[gallery.status]}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" asChild aria-label={`Gerenciar fotos de ${gallery.title}`}>
                  <Link href={`/admin/photo-gallery/galleries/${gallery.id}`}>
                    <Images className="size-4" />
                  </Link>
                </Button>
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
