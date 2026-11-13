import type { OperationResult } from "@venore/plugin-sdk";
import type { GalleryPhotoRecord } from "../../contracts/types";

// Vincula assets que JÁ estão no MMS (enviados pelo uploadFileToMediaLibrary do SDK ou
// escolhidos da biblioteca) a uma galeria. O plugin nunca recebe bytes — upload é do core.
export type AttachPhotosCommand = {
  galleryId: string;
  mediaIds: string[];
  actorId: string;
};

export type AttachPhotosInput = Omit<AttachPhotosCommand, "actorId">;

export type AttachPhotosOutcome = {
  attached: GalleryPhotoRecord[];
  // Já estavam na galeria (vincular de novo não duplica).
  alreadyInGallery: number;
  // Não existem, não são imagem, ou o ator não pode lê-los no MMS.
  rejectedMediaIds: string[];
};

export type AttachPhotosResult = OperationResult<AttachPhotosOutcome>;
