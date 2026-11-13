"use client";

import { useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button, Progress, cn, uploadFileToMediaLibrary } from "@venore/plugin-sdk/ui";
import { attachPhotosAction } from "./actions";
import { LibraryPickerDialog } from "./library-picker-dialog";
import { summarizeAttach } from "./attach-summary";

// Envios simultâneos ao MMS — o bastante pra não esperar foto por foto, pouco o bastante pra não
// encher a memória da função (o caminho buffered segura o arquivo inteiro).
const UPLOAD_CONCURRENCY = 3;
// Lote de vínculo por chamada (attach-photos aceita até 200).
const ATTACH_BATCH = 200;

type UploadProgress = { done: number; total: number };

function isImageFile(file: File): boolean {
  // HEIC do iPhone chega com type vazio fora do Safari — o MMS deduz pela extensão e confere os bytes.
  return file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
}

export function AddPhotosPanel({ galleryId, mediaIdsInGallery }: { galleryId: string; mediaIdsInGallery: string[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [dragging, setDragging] = useState(false);
  const busy = progress !== null;

  async function attach(mediaIds: string[]): Promise<boolean> {
    let attachedCount = 0;
    let alreadyInGallery = 0;
    let rejectedCount = 0;
    for (let index = 0; index < mediaIds.length; index += ATTACH_BATCH) {
      const result = await attachPhotosAction({ galleryId, mediaIds: mediaIds.slice(index, index + ATTACH_BATCH) });
      if (result.error) {
        toast.error(result.error);
        return false;
      }
      attachedCount += result.attachedCount;
      alreadyInGallery += result.alreadyInGallery;
      rejectedCount += result.rejectedCount;
    }
    toast.success(summarizeAttach({ attachedCount, alreadyInGallery, rejectedCount }));
    router.refresh();
    return true;
  }

  // Cada arquivo vai sozinho pro MMS (uploadFileToMediaLibrary escolhe buffered ou upload direto
  // ao storage) — nunca um body com todos os arquivos, que estourava o limite da server action.
  // Falha num arquivo não derruba os outros; no fim, só os que entraram no MMS são vinculados.
  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter(isImageFile);
    const skipped = Array.from(fileList).length - files.length;
    if (skipped > 0) toast.warning(`${skipped} arquivo(s) ignorado(s): não são imagens.`);
    if (files.length === 0) return;

    setProgress({ done: 0, total: files.length });
    const uploadedIds: string[] = new Array(files.length);
    const failures: string[] = [];
    let cursor = 0;

    async function worker() {
      while (cursor < files.length) {
        const index = cursor++;
        const file = files[index];
        const result = await uploadFileToMediaLibrary(file);
        if (result.success) uploadedIds[index] = result.data.id;
        else failures.push(`${file.name}: ${result.error.message}`);
        setProgress((current) => (current ? { ...current, done: current.done + 1 } : current));
      }
    }

    try {
      await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, files.length) }, worker));
      if (failures.length > 0) {
        toast.error(`${failures.length} foto(s) não enviada(s)`, { description: failures.slice(0, 5).join("\n") });
      }
      // Ordem de seleção preservada (o array é indexado pela posição do arquivo).
      const ids = uploadedIds.filter(Boolean);
      if (ids.length > 0) await attach(ids);
    } finally {
      setProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (busy) return;
    if (event.dataTransfer.files.length > 0) void uploadFiles(event.dataTransfer.files);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!busy) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col gap-3 rounded-panel border border-dashed border-border p-4 sm:flex-row sm:items-center sm:justify-between",
        dragging && "border-ring bg-accent/14",
      )}
    >
      <div className="min-w-0 space-y-2">
        <p className="text-sm font-medium text-foreground">Adicionar fotos</p>
        {progress ? (
          <div className="space-y-1" aria-live="polite">
            <Progress value={(progress.done / progress.total) * 100} className="h-2 w-full sm:w-64" />
            <p className="text-xs text-muted-foreground">
              Enviando {progress.done} de {progress.total} para a biblioteca de mídia...
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Arraste imagens para cá ou envie do computador. Os arquivos vão para a biblioteca de mídia e podem ser reaproveitados.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
          multiple
          className="hidden"
          onChange={(event) => event.target.files && void uploadFiles(event.target.files)}
        />
        <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Enviar fotos
        </Button>
        <LibraryPickerDialog
          disabled={busy}
          excludedMediaIds={mediaIdsInGallery}
          onConfirm={attach}
          trigger={
            <Button type="button" variant="outline" disabled={busy}>
              <ImagePlus className="size-4" />
              Escolher da biblioteca
            </Button>
          }
        />
      </div>
    </div>
  );
}
