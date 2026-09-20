"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { deleteGalleryAction, type GalleryActionState } from "./actions";

const initialState: GalleryActionState = { error: null };

export function DeleteGalleryButton({ galleryId, title }: { galleryId: string; title: string }) {
  const [state, formAction, pending] = useActionState(deleteGalleryAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `${title} removida.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover a galeria "${title}" e todas as suas fotos?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="galleryId" value={galleryId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${title}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
