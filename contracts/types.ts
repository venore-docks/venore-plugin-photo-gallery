export type GalleryStatus = "draft" | "published";

export type GalleryRecord = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  status: GalleryStatus;
  publishedAt: Date | null;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GalleryPhotoRecord = {
  id: string;
  galleryId: string;
  mediaId: string;
  caption: string | null;
  order: number;
  createdAt: Date;
};
