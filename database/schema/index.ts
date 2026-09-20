import { sql } from "drizzle-orm";
import { check, integer, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const photoGallerySchema = pgSchema("photo_gallery");

// category é texto livre (não uma tabela própria) — decisão de escopo do v1
// (PORTAL-COLABORADOR-FEM.md §6.2): o legado tinha uma entidade de categorias separada, mas o
// pedido do cliente foi "refatorar corrigindo gaps", não reproduzir 1:1. Uma tag livre cobre o
// caso de uso real (agrupar por evento/época) sem precisar de outra tela de CRUD.
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
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("photo_gallery_galleries_status_check", sql`${table.status} in ('draft', 'published')`)],
);

// mediaId aponta pro asset em contexts/media (schema do core) — sem FK cruzando schema de
// plugin/core (regra 5, cada plugin isola o próprio domínio). A validação de existência acontece
// em runtime, via getMediaAsset (@venore/plugin-sdk/media), não via constraint de banco.
export const photoGalleryPhotos = photoGallerySchema.table("photos", {
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
});
