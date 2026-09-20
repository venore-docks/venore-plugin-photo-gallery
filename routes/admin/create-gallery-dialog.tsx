"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
import { createGalleryAction, type GalleryActionState } from "./actions";
import { GalleryFields } from "./gallery-fields";

const initialState: GalleryActionState = { error: null };

export function CreateGalleryDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createGalleryAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Galeria cadastrada.", onSuccess: () => setOpen(false) });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nova galeria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova galeria</DialogTitle>
          <DialogDescription>Depois de criada, adicione fotos na tela de gerenciamento da galeria.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          <GalleryFields />
          <Button type="submit" disabled={pending} className="w-full">
            Cadastrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
