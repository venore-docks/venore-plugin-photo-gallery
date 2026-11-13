"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  ImageOff,
  MoreVertical,
  Pencil,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Textarea,
  cn,
} from "@venore/plugin-sdk/ui";
import type { GalleryPhotoAdminView } from "../../index";
import { movePhotoId, type PhotoMove } from "../../shared/reorder";
import { PHOTO_CAPTION_MAX } from "../../shared/validation";
import { deletePhotosAction, reorderPhotosAction, setGalleryCoverAction, updatePhotoCaptionAction } from "./actions";

export function PhotoManager({
  galleryId,
  photos,
  coverPhotoId,
}: {
  galleryId: string;
  photos: GalleryPhotoAdminView[];
  coverPhotoId: string | null;
}) {
  const router = useRouter();
  const [order, setOrder] = useState(() => photos.map((photo) => photo.id));
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);
  const [editing, setEditing] = useState<GalleryPhotoAdminView | null>(null);
  const [pending, startTransition] = useTransition();

  // Dado novo do servidor (router.refresh depois de adicionar/remover) redefine a ordem local.
  useEffect(() => {
    setOrder(photos.map((photo) => photo.id));
    setSelected((current) => current.filter((id) => photos.some((photo) => photo.id === id)));
  }, [photos]);

  const byId = new Map(photos.map((photo) => [photo.id, photo]));
  const ordered = order.flatMap((id) => byId.get(id) ?? []);
  // Capa efetiva: a escolhida, ou a primeira foto (mesma regra do servidor, gallery-sql.ts).
  const effectiveCoverId = coverPhotoId && byId.has(coverPhotoId) ? coverPhotoId : (ordered[0]?.id ?? null);

  if (ordered.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma foto nesta galeria ainda.</p>;
  }

  function run(task: () => Promise<{ error: string | null }>, success: string, onError?: () => void) {
    startTransition(async () => {
      const result = await task();
      if (result.error) {
        onError?.();
        toast.error(result.error);
        return;
      }
      toast.success(success);
      router.refresh();
    });
  }

  function move(photoId: string, direction: PhotoMove) {
    const previous = order;
    const next = movePhotoId(order, photoId, direction);
    if (next.join() === previous.join()) return;
    setOrder(next); // otimista
    run(() => reorderPhotosAction({ galleryId, photoIds: next }), "Ordem salva.", () => setOrder(previous));
  }

  function toggleSelected(photoId: string) {
    setSelected((current) => (current.includes(photoId) ? current.filter((id) => id !== photoId) : [...current, photoId]));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {ordered.length === 1 ? "1 foto" : `${ordered.length} fotos`} · a ordem abaixo é a da página pública
        </p>
        {selected.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-foreground">{selected.length} selecionada(s)</span>
            <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
              Limpar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(selected)} disabled={pending}>
              <Trash2 className="size-4" />
              Remover selecionadas
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setSelected(order)}>
            Selecionar todas
          </Button>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {ordered.map((photo, index) => {
          const isSelected = selected.includes(photo.id);
          const isCover = photo.id === effectiveCoverId;
          return (
            <li
              key={photo.id}
              className={cn(
                "group flex flex-col overflow-hidden rounded-panel border border-border bg-card",
                isSelected && "ring-2 ring-primary",
              )}
            >
              <div className="relative aspect-square bg-muted">
                {photo.thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- URL do MMS (storage remoto, sem next/image configurado no core)
                  <img src={photo.thumbUrl} alt={photo.caption ?? `Foto ${index + 1}`} loading="lazy" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-1 p-2 text-center text-muted-foreground">
                    <ImageOff className="size-5" aria-hidden />
                    <span className="text-xs">Arquivo indisponível na biblioteca</span>
                  </div>
                )}

                <label className="absolute start-2 top-2 flex size-7 cursor-pointer items-center justify-center rounded-md bg-background/80">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelected(photo.id)}
                    aria-label={`Selecionar foto ${index + 1}`}
                    className="size-4 accent-primary"
                  />
                </label>

                {isCover && (
                  <Badge className="absolute bottom-2 start-2 gap-1">
                    <Star className="size-3" aria-hidden />
                    Capa{coverPhotoId === photo.id ? "" : " (automática)"}
                  </Badge>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      aria-label={`Ações da foto ${index + 1}`}
                      className="absolute end-2 top-2 size-7"
                      disabled={pending}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {coverPhotoId === photo.id ? (
                      <DropdownMenuItem
                        onSelect={() => run(() => setGalleryCoverAction({ galleryId, photoId: null }), "Capa automática (primeira foto).")}
                      >
                        <StarOff className="size-4" />
                        Usar capa automática
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onSelect={() => run(() => setGalleryCoverAction({ galleryId, photoId: photo.id }), "Capa definida.")}
                      >
                        <Star className="size-4" />
                        Definir como capa
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => setEditing(photo)}>
                      <Pencil className="size-4" />
                      Editar legenda
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled={index === 0} onSelect={() => move(photo.id, "first")}>
                      <ChevronsLeft className="size-4" />
                      Mover para o início
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={index === 0} onSelect={() => move(photo.id, "previous")}>
                      <ArrowLeft className="size-4" />
                      Mover uma posição para trás
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={index === ordered.length - 1} onSelect={() => move(photo.id, "next")}>
                      <ArrowRight className="size-4" />
                      Mover uma posição para frente
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={index === ordered.length - 1} onSelect={() => move(photo.id, "last")}>
                      <ChevronsRight className="size-4" />
                      Mover para o fim
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete([photo.id])}>
                      <Trash2 className="size-4" />
                      Remover da galeria
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-start gap-1 p-2">
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{index + 1}.</span>
                <button
                  type="button"
                  onClick={() => setEditing(photo)}
                  className="min-w-0 flex-1 truncate rounded-sm text-start text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {photo.caption || "Adicionar legenda"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <CaptionDialog
        photo={editing}
        pending={pending}
        onClose={() => setEditing(null)}
        onSave={(caption) =>
          editing &&
          run(
            async () => {
              const result = await updatePhotoCaptionAction({ galleryId, photoId: editing.id, caption });
              if (!result.error) setEditing(null);
              return result;
            },
            "Legenda salva.",
          )
        }
      />

      <AlertDialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remover {confirmDelete?.length === 1 ? "esta foto" : `${confirmDelete?.length ?? 0} fotos`} da galeria?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Os arquivos continuam na biblioteca de mídia e podem ser adicionados de novo depois.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => {
                const photoIds = confirmDelete ?? [];
                setConfirmDelete(null);
                setSelected((current) => current.filter((id) => !photoIds.includes(id)));
                run(() => deletePhotosAction({ galleryId, photoIds }), photoIds.length === 1 ? "Foto removida." : "Fotos removidas.");
              }}
            >
              Remover
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CaptionDialog({
  photo,
  pending,
  onClose,
  onSave,
}: {
  photo: GalleryPhotoAdminView | null;
  pending: boolean;
  onClose: () => void;
  onSave: (caption: string) => void;
}) {
  return (
    <Dialog open={photo !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Legenda da foto</DialogTitle>
          <DialogDescription>Aparece na página pública, ao ampliar a foto, e é lida por leitores de tela.</DialogDescription>
        </DialogHeader>
        {photo && (
          <form
            key={photo.id}
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              onSave(String(new FormData(event.currentTarget).get("caption") ?? ""));
            }}
          >
            {photo.thumbUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- URL do MMS (storage remoto)
              <img src={photo.thumbUrl} alt="" className="mx-auto max-h-48 rounded-panel object-contain" />
            )}
            <Textarea name="caption" defaultValue={photo.caption ?? ""} rows={3} maxLength={PHOTO_CAPTION_MAX} autoFocus />
            <Button type="submit" disabled={pending} className="w-full">
              Salvar legenda
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
