import type { CreateGalleryInput } from "./types";

export type GalleryValidationError = { code: string; message: string };

export function validateCreateGalleryInput(input: CreateGalleryInput): GalleryValidationError | null {
  if (input.title.trim().length === 0) {
    return { code: "photo-gallery.invalid_title", message: "O título da galeria não pode ser vazio." };
  }
  return null;
}
