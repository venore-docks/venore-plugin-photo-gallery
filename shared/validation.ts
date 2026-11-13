import type { PhotoGalleryError } from "../contracts/types";

export const GALLERY_TITLE_MAX = 200;
export const GALLERY_CATEGORY_MAX = 80;
export const GALLERY_DESCRIPTION_MAX = 4000;
export const PHOTO_CAPTION_MAX = 500;
// Teto por chamada de attach/delete/reorder — o mesmo de getMediaAssetUrls (MMS).
export const PHOTO_BATCH_MAX = 200;

export type GalleryFieldsInput = {
  title: string;
  category?: string | null;
  description?: string | null;
  eventDate?: string | null;
};

const EVENT_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// "YYYY-MM-DD" de calendário real (rejeita 2026-02-30) — a coluna é `date`, o Postgres recusaria
// com erro 500 em vez de OperationResult.
export function isValidEventDate(value: string): boolean {
  const match = EVENT_DATE_PATTERN.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function validateGalleryFields(input: GalleryFieldsInput): PhotoGalleryError | null {
  const title = input.title.trim();
  if (title.length === 0) {
    return { code: "photo-gallery.invalid_title", message: "O título da galeria não pode ser vazio." };
  }
  if (title.length > GALLERY_TITLE_MAX) {
    return { code: "photo-gallery.invalid_title", message: `O título pode ter no máximo ${GALLERY_TITLE_MAX} caracteres.` };
  }
  if ((input.category?.trim().length ?? 0) > GALLERY_CATEGORY_MAX) {
    return { code: "photo-gallery.invalid_category", message: `A categoria pode ter no máximo ${GALLERY_CATEGORY_MAX} caracteres.` };
  }
  if ((input.description?.trim().length ?? 0) > GALLERY_DESCRIPTION_MAX) {
    return {
      code: "photo-gallery.invalid_description",
      message: `A descrição pode ter no máximo ${GALLERY_DESCRIPTION_MAX} caracteres.`,
    };
  }
  const eventDate = input.eventDate?.trim();
  if (eventDate && !isValidEventDate(eventDate)) {
    return { code: "photo-gallery.invalid_event_date", message: "Data do evento inválida (use AAAA-MM-DD)." };
  }
  return null;
}

// Mesma normalização pra create/update: texto opcional vazio vira null.
export function normalizeGalleryFields(input: GalleryFieldsInput) {
  return {
    title: input.title.trim(),
    category: input.category?.trim() || null,
    description: input.description?.trim() || null,
    eventDate: input.eventDate?.trim() || null,
  };
}

// Lista de ids vinda de formulário: sem vazios, sem repetidos, ordem preservada.
export function uniqueIds(ids: readonly string[]): string[] {
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
}

export function validateIdBatch(ids: readonly string[], label: string): PhotoGalleryError | null {
  if (ids.length === 0) {
    return { code: "photo-gallery.empty_batch", message: `Selecione ao menos uma ${label}.` };
  }
  if (ids.length > PHOTO_BATCH_MAX) {
    return { code: "photo-gallery.batch_too_large", message: `No máximo ${PHOTO_BATCH_MAX} por vez.` };
  }
  return null;
}
