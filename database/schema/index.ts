import { sql } from "drizzle-orm";
import { check, date, index, integer, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const photoGallerySchema = pgSchema("photo_gallery");

// category é texto livre (não uma tabela própria) — decisão de escopo do v1
// (PORTAL-COLABORADOR-FEM.md §6.2): uma tag livre cobre o caso de uso real (agrupar por
// evento/época) sem precisar de outra tela de CRUD. O bloco de página filtra por ela.
export const photoGalleries = photoGallerySchema.table(
  "galleries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    category: text("category"),
    description: text("description"),
    status: text("status").notNull().default("draft"),
    // Data em que o evento aconteceu (não a de publicação) — ordena a listagem pública. Opcional:
    // sem ela, vale publishedAt.
    eventDate: date("event_date", { mode: "string" }),
    // Foto escolhida como capa. Sem FK de propósito (photos já referencia galleries — FK circular
    // complicaria o delete em cascata): foto apagada zera o campo no mesmo comando
    // (delete-photos/store.ts), e capa nula/órfã cai na primeira foto pela ordem.
    coverPhotoId: text("cover_photo_id"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("photo_gallery_galleries_status_check", sql`${table.status} in ('draft', 'published')`)],
);

// mediaId aponta pro asset do MMS (contexts/media, schema do core) — sem FK cruzando schema de
// plugin/core (cada plugin isola o próprio domínio). Existência e tipo são conferidos em runtime
// no attach (getMediaAsset), e asset sem leitura/apagado simplesmente não aparece na galeria.
export const photoGalleryPhotos = photoGallerySchema.table(
  "photos",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    galleryId: text("gallery_id")
      .notNull()
      .references(() => photoGalleries.id, { onDelete: "cascade" }),
    mediaId: text("media_id").notNull(),
    caption: text("caption"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // Toda leitura de fotos é "as fotos da galeria X pela ordem" (detalhe, capa, admin).
  (table) => [index("photo_gallery_photos_gallery_order_idx").on(table.galleryId, table.order)],
);
