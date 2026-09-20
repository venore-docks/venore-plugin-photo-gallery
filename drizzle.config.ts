import { defineConfig } from "drizzle-kit";

// Migrations próprias do plugin (mesmo padrão de venore-plugin-birthdays/drizzle.config.ts):
// separado do drizzle.config.ts raiz de propósito, pra core e photo-gallery não competirem pela
// mesma história de migration.
export default defineConfig({
  schema: ["./database/schema/index.ts"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  migrations: { schema: "photo_gallery_migrations", table: "__drizzle_migrations" },
});
