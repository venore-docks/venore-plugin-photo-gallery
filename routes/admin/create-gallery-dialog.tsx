"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
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

// Sucesso redireciona (createGalleryAction) pra tela da galeria — o toast aqui só cobre o erro.
export function CreateGalleryDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createGalleryAction, initialState);
  useActionToast({ pending, error: state.error });

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
          <DialogDescription>Depois de criar, você vai direto para a tela de adicionar fotos.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          <GalleryFields />
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Criando..." : "Criar e adicionar fotos"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
