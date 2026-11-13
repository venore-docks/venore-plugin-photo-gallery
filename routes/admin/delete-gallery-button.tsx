"use client";

import { useActionState, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  useActionToast,
} from "@venore/plugin-sdk/ui";
import { deleteGalleryAction, type GalleryActionState } from "./actions";

const initialState: GalleryActionState = { error: null };

export function DeleteGalleryButton({
  galleryId,
  title,
  redirectToList = false,
}: {
  galleryId: string;
  title: string;
  redirectToList?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(deleteGalleryAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `${title} removida.`, onSuccess: () => setOpen(false) });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {redirectToList ? (
          <Button variant="outline">
            <Trash2 className="size-4" />
            Remover galeria
          </Button>
        ) : (
          <Button variant="ghost" size="icon" aria-label={`Remover ${title}`}>
            <Trash2 className="size-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover a galeria “{title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            A galeria e a lista de fotos dela somem do site. Os arquivos continuam na biblioteca de mídia.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="galleryId" value={galleryId} />
            {redirectToList && <input type="hidden" name="redirectToList" value="1" />}
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Removendo..." : "Remover"}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
