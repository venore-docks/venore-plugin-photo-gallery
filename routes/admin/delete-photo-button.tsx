"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { deletePhotoAction, type GalleryActionState } from "./actions";

const initialState: GalleryActionState = { error: null };

export function DeletePhotoButton({ photoId, galleryId }: { photoId: string; galleryId: string }) {
  const [state, formAction, pending] = useActionState(deletePhotoAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Foto removida." });

  return (
    <form action={formAction}>
      <input type="hidden" name="photoId" value={photoId} />
      <input type="hidden" name="galleryId" value={galleryId} />
      <Button
        type="submit"
        variant="secondary"
        size="icon"
        disabled={pending}
        aria-label="Remover foto"
        className="absolute right-2 top-2 size-7"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </form>
  );
}
