"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Check, ImageOff, Loader2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
  listCategoriesForPickerAction,
  type PickableCategory,
} from "@venore/plugin-sdk/ui";
import { listLibraryImagesAction, type LibraryImage } from "./actions";

// Seleção MÚLTIPLA na biblioteca do MMS (o MediaPickerField do core escolhe um arquivo só). A
// lista e as categorias vêm do core com a sessão do ator — quem vê o quê é regra do MMS.
export function LibraryPickerDialog({
  trigger,
  disabled,
  excludedMediaIds,
  onConfirm,
}: {
  trigger: ReactNode;
  disabled?: boolean;
  excludedMediaIds: string[];
  onConfirm: (mediaIds: string[]) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<LibraryImage[]>([]);
  const [categories, setCategories] = useState<PickableCategory[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, startLoading] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const excluded = new Set(excludedMediaIds);

  function load(nextCategoryId: string, nextPage: number) {
    startLoading(async () => {
      const result = await listLibraryImagesAction({ categoryId: nextCategoryId || undefined, page: nextPage });
      setError(result.error);
      setItems((current) => (nextPage === 0 ? result.items : [...current, ...result.items]));
      setHasMore(result.hasMore);
      setPage(nextPage);
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) return;
    setSelected([]);
    load(categoryId, 0);
    if (categories.length === 0) listCategoriesForPickerAction().then(setCategories);
  }

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  }

  async function confirm() {
    setConfirming(true);
    const ok = await onConfirm(selected);
    setConfirming(false);
    if (ok) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Escolher da biblioteca de mídia</DialogTitle>
          <DialogDescription>Clique nas imagens para selecionar várias de uma vez.</DialogDescription>
        </DialogHeader>

        {categories.length > 0 && (
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            Categoria
            <select
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                load(event.target.value, 0);
              }}
              className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {items.map((item) => {
            const inGallery = excluded.has(item.id);
            const isSelected = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                disabled={inGallery}
                aria-pressed={isSelected}
                title={inGallery ? `${item.filename} (já está na galeria)` : item.filename}
                onClick={() => toggle(item.id)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border border-border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected && "ring-2 ring-primary",
                  inGallery && "cursor-not-allowed opacity-40",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- URL do MMS (storage remoto) */}
                <img src={item.thumbUrl} alt={item.filename} loading="lazy" className="size-full object-cover" />
                {isSelected && (
                  <span className="absolute end-1 top-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                )}
              </button>
            );
          })}
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`s-${index}`} className="aspect-square animate-pulse rounded-lg bg-muted" aria-hidden />
            ))}
          {!loading && items.length === 0 && !error && (
            <div className="col-span-full flex flex-col items-center gap-2 py-8 text-center">
              <ImageOff className="size-6 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">Nenhuma imagem nesta categoria da biblioteca.</p>
            </div>
          )}
        </div>

        {hasMore && !loading && (
          <Button type="button" variant="outline" onClick={() => load(categoryId, page + 1)} className="w-full">
            Carregar mais
          </Button>
        )}

        <DialogFooter className="gap-2 sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{selected.length} selecionada(s)</p>
          <Button type="button" onClick={confirm} disabled={selected.length === 0 || confirming}>
            {confirming && <Loader2 className="size-4 animate-spin" />}
            Adicionar à galeria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
