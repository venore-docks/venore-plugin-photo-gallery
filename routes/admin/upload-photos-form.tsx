"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@venore/plugin-sdk/ui";
import { addPhotosAction, type GalleryActionState } from "./actions";

const initialState: GalleryActionState = { error: null };

// Upload multi-arquivo com useTransition + FormData manual (não useActionState ligado a <form
// action={}>) — mesmo padrão de venore-plugin-birthdays/routes/admin/import-birthdays-csv-dialog.tsx,
// necessário porque um <input type="file" multiple> não reseta sozinho após submit controlado.
export function UploadPhotosForm({ galleryId }: { galleryId: string }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, startUploadTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(event.target.files ?? []));
  }

  function handleUpload() {
    if (selectedFiles.length === 0) {
      toast.error("Selecione ao menos uma foto.");
      return;
    }

    const formData = new FormData();
    formData.set("galleryId", galleryId);
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    startUploadTransition(async () => {
      const result: GalleryActionState = await addPhotosAction(initialState, formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${selectedFiles.length} foto(s) adicionada(s).`);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-panel border border-dashed border-border p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground"
      />
      <Button type="button" onClick={handleUpload} disabled={selectedFiles.length === 0 || isUploading}>
        <Upload className="size-4" />
        {isUploading ? "Enviando..." : `Enviar ${selectedFiles.length || ""} foto(s)`}
      </Button>
    </div>
  );
}
