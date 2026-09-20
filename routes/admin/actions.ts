"use server";

import { revalidatePath } from "next/cache";
import { createGallery, deleteGallery, updateGallery, addPhotos, deletePhoto } from "../../index";
import { isPluginActive } from "@venore/plugin-sdk";
import type { GalleryStatus } from "../../contracts/types";

export type GalleryActionState = { error: string | null };

const listPath = "/admin/photo-gallery";
const PLUGIN_DISABLED_ERROR = "O plugin Galeria de fotos está desabilitado.";

function readStatus(formData: FormData): GalleryStatus {
  return String(formData.get("status") ?? "draft") === "published" ? "published" : "draft";
}

export async function createGalleryAction(
  _prevState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await isPluginActive("photo-gallery"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await createGallery({
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? "") || undefined,
    description: String(formData.get("description") ?? "") || undefined,
    status: readStatus(formData),
  });

  if (!result.success) return { error: result.error.message };
  revalidatePath(listPath);
  return { error: null };
}

export async function updateGalleryAction(
  _prevState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await isPluginActive("photo-gallery"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await updateGallery({
    galleryId: String(formData.get("galleryId") ?? ""),
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? "") || undefined,
    description: String(formData.get("description") ?? "") || undefined,
    status: readStatus(formData),
  });

  if (!result.success) return { error: result.error.message };
  revalidatePath(listPath);
  return { error: null };
}

export async function deleteGalleryAction(
  _prevState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await isPluginActive("photo-gallery"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await deleteGallery({ galleryId: String(formData.get("galleryId") ?? "") });
  if (!result.success) return { error: result.error.message };
  revalidatePath(listPath);
  return { error: null };
}

export async function addPhotosAction(
  _prevState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await isPluginActive("photo-gallery"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const galleryId = String(formData.get("galleryId") ?? "");
  const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length === 0) {
    return { error: "Selecione ao menos uma foto." };
  }

  const uploadFiles = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
    })),
  );

  const result = await addPhotos({ galleryId, files: uploadFiles });
  if (!result.success) return { error: result.error.message };
  revalidatePath(`/admin/photo-gallery/galleries/${galleryId}`);
  return { error: null };
}

export async function deletePhotoAction(
  _prevState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await isPluginActive("photo-gallery"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const galleryId = String(formData.get("galleryId") ?? "");
  const result = await deletePhoto({ photoId: String(formData.get("photoId") ?? "") });
  if (!result.success) return { error: result.error.message };
  revalidatePath(`/admin/photo-gallery/galleries/${galleryId}`);
  return { error: null };
}
