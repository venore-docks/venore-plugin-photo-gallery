"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isPluginActive } from "@venore/plugin-sdk";
import { listMediaAssets, pickMediaVariantUrl } from "@venore/plugin-sdk/media";
import {
  attachPhotos,
  createGallery,
  deleteGallery,
  deletePhotos,
  reorderPhotos,
  setGalleryCover,
  updateGallery,
  updatePhotoCaption,
} from "../../index";
import type { GalleryStatus } from "../../contracts/types";

export type GalleryActionState = { error: string | null };

const ADMIN_PATH = "/admin/photo-gallery";
const PLUGIN_DISABLED_ERROR = "O plugin Galeria de fotos está desabilitado.";

// Quem pode o quê é decidido pelo core: authorizeActor (RBAC) dentro de cada handler, MMS na
// leitura/envio de mídia. Aqui só fica o "plugin ligado?" — server action não passa pelo
// roteador de plugin do core (resolvePublicPluginRoute/getPluginAdminPageData), então é o único
// ponto que não herda essa checagem.
async function pluginDisabled(): Promise<boolean> {
  return !(await isPluginActive("photo-gallery"));
}

function galleryPath(galleryId: string): string {
  return `${ADMIN_PATH}/galleries/${galleryId}`;
}

// Páginas públicas (/galerias e /galerias/<slug>) + admin.
function revalidateGallery(galleryId?: string) {
  revalidatePath(ADMIN_PATH);
  if (galleryId) revalidatePath(galleryPath(galleryId));
  revalidatePath("/galerias", "layout");
}

function readText(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "");
}

function readStatus(formData: FormData): GalleryStatus {
  return readText(formData, "status") === "published" ? "published" : "draft";
}

function readGalleryFields(formData: FormData) {
  return {
    title: readText(formData, "title"),
    category: readText(formData, "category") || null,
    description: readText(formData, "description") || null,
    eventDate: readText(formData, "eventDate") || null,
    status: readStatus(formData),
  };
}

export async function createGalleryAction(_prevState: GalleryActionState, formData: FormData): Promise<GalleryActionState> {
  if (await pluginDisabled()) return { error: PLUGIN_DISABLED_ERROR };

  const result = await createGallery(readGalleryFields(formData));
  if (!result.success) return { error: result.error.message };

  revalidateGallery();
  // Galeria nova não tem foto nenhuma — leva direto pra tela onde elas são adicionadas.
  redirect(galleryPath(result.data.id));
}

export async function updateGalleryAction(_prevState: GalleryActionState, formData: FormData): Promise<GalleryActionState> {
  if (await pluginDisabled()) return { error: PLUGIN_DISABLED_ERROR };

  const galleryId = readText(formData, "galleryId");
  const result = await updateGallery({ galleryId, ...readGalleryFields(formData) });
  if (!result.success) return { error: result.error.message };

  revalidateGallery(galleryId);
  return { error: null };
}

export async function deleteGalleryAction(_prevState: GalleryActionState, formData: FormData): Promise<GalleryActionState> {
  if (await pluginDisabled()) return { error: PLUGIN_DISABLED_ERROR };

  const galleryId = readText(formData, "galleryId");
  const result = await deleteGallery({ galleryId });
  if (!result.success) return { error: result.error.message };

  revalidateGallery(galleryId);
  if (formData.get("redirectToList") === "1") redirect(ADMIN_PATH);
  return { error: null };
}

export type AttachPhotosActionResult = {
  error: string | null;
  attachedCount: number;
  alreadyInGallery: number;
  rejectedCount: number;
};

// Recebe ids de assets que JÁ estão no MMS (upload feito pelo navegador com
// uploadFileToMediaLibrary, ou escolha na biblioteca) — nunca bytes.
export async function attachPhotosAction(input: { galleryId: string; mediaIds: string[] }): Promise<AttachPhotosActionResult> {
  const empty = { attachedCount: 0, alreadyInGallery: 0, rejectedCount: 0 };
  if (await pluginDisabled()) return { error: PLUGIN_DISABLED_ERROR, ...empty };

  const result = await attachPhotos({ galleryId: String(input.galleryId), mediaIds: input.mediaIds.map(String) });
  if (!result.success) return { error: result.error.message, ...empty };

  revalidateGallery(input.galleryId);
  return {
    error: null,
    attachedCount: result.data.attached.length,
    alreadyInGallery: result.data.alreadyInGallery,
    rejectedCount: result.data.rejectedMediaIds.length,
  };
}

export async function deletePhotosAction(input: { galleryId: string; photoIds: string[] }): Promise<GalleryActionState> {
  if (await pluginDisabled()) return { error: PLUGIN_DISABLED_ERROR };

  const result = await deletePhotos({ galleryId: String(input.galleryId), photoIds: input.photoIds.map(String) });
  if (!result.success) return { error: result.error.message };

  revalidateGallery(input.galleryId);
  return { error: null };
}

export async function updatePhotoCaptionAction(input: {
  galleryId: string;
  photoId: string;
  caption: string;
}): Promise<GalleryActionState> {
  if (await pluginDisabled()) return { error: PLUGIN_DISABLED_ERROR };

  const result = await updatePhotoCaption({
    galleryId: String(input.galleryId),
    photoId: String(input.photoId),
    caption: String(input.caption ?? ""),
  });
  if (!result.success) return { error: result.error.message };

  revalidateGallery(input.galleryId);
  return { error: null };
}

export async function reorderPhotosAction(input: { galleryId: string; photoIds: string[] }): Promise<GalleryActionState> {
  if (await pluginDisabled()) return { error: PLUGIN_DISABLED_ERROR };

  const result = await reorderPhotos({ galleryId: String(input.galleryId), photoIds: input.photoIds.map(String) });
  if (!result.success) return { error: result.error.message };

  revalidateGallery(input.galleryId);
  return { error: null };
}

export async function setGalleryCoverAction(input: { galleryId: string; photoId: string | null }): Promise<GalleryActionState> {
  if (await pluginDisabled()) return { error: PLUGIN_DISABLED_ERROR };

  const result = await setGalleryCover({
    galleryId: String(input.galleryId),
    photoId: input.photoId === null ? null : String(input.photoId),
  });
  if (!result.success) return { error: result.error.message };

  revalidateGallery(input.galleryId);
  return { error: null };
}

export type LibraryImage = { id: string; filename: string; thumbUrl: string };
export type LibraryPage = { items: LibraryImage[]; hasMore: boolean; error: string | null };

const LIBRARY_PAGE_SIZE = 96;

// Imagens da biblioteca do MMS pra escolher em lote. A lista vem de listMediaAssets com a sessão
// do ator — o que ele pode ver na biblioteca é regra do core (media.manage, dono, visibilidade).
export async function listLibraryImagesAction(input: { categoryId?: string; page?: number }): Promise<LibraryPage> {
  if (await pluginDisabled()) return { items: [], hasMore: false, error: PLUGIN_DISABLED_ERROR };

  const page = Math.max(Math.trunc(Number(input.page) || 0), 0);
  const result = await listMediaAssets({
    categoryId: input.categoryId ? String(input.categoryId) : undefined,
    limit: LIBRARY_PAGE_SIZE,
    offset: page * LIBRARY_PAGE_SIZE,
  });
  if (!result.success) return { items: [], hasMore: false, error: result.error.message };

  return {
    items: result.data
      .filter((asset) => asset.contentType.startsWith("image/"))
      .map((asset) => ({ id: asset.id, filename: asset.filename, thumbUrl: pickMediaVariantUrl(asset, 160) })),
    hasMore: result.data.length === LIBRARY_PAGE_SIZE,
    error: null,
  };
}
