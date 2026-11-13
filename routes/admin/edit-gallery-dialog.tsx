"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
import { updateGalleryAction, type GalleryActionState } from "./actions";
import { GalleryFields } from "./gallery-fields";
import type { GalleryRecord } from "../../index";

const initialState: GalleryActionState = { error: null };

export function EditGalleryDialog({ gallery, withLabel = false }: { gallery: GalleryRecord; withLabel?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateGalleryAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Galeria atualizada.", onSuccess: () => setOpen(false) });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {withLabel ? (
          <Button variant="outline">
            <Pencil className="size-4" />
            Editar dados
          </Button>
        ) : (
          <Button variant="ghost" size="icon" aria-label={`Editar ${gallery.title}`}>
            <Pencil className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar galeria</DialogTitle>
          <DialogDescription>{gallery.title}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="galleryId" value={gallery.id} />
          <GalleryFields
            defaultTitle={gallery.title}
            defaultCategory={gallery.category ?? ""}
            defaultDescription={gallery.description ?? ""}
            defaultEventDate={gallery.eventDate ?? ""}
            defaultStatus={gallery.status}
          />
          <Button type="submit" disabled={pending} className="w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
