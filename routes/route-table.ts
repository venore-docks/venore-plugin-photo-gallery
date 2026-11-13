import { asPluginPage, type PluginRouteTable } from "@venore/plugin-sdk";
import AdminPage from "./admin/page";
import AdminGalleryDetailPage from "./admin/gallery-detail/page";
import PublicPage from "./public/page";
import PublicGalleryPage from "./public/gallery/page";
import { buildGalleryMetadata } from "./public/metadata";

export const photoGalleryRouteTable: PluginRouteTable = {
  admin: [
    { pattern: "", Component: asPluginPage(AdminPage) },
    { pattern: "galleries/:id", Component: asPluginPage(AdminGalleryDetailPage) },
  ],
  public: [
    { pattern: "galerias", Component: asPluginPage(PublicPage), generateMetadata: async () => ({ title: "Galeria de fotos" }) },
    {
      pattern: "galerias/:slug",
      Component: asPluginPage(PublicGalleryPage),
      generateMetadata: async ({ params }) => buildGalleryMetadata((await params).slug ?? ""),
    },
  ],
};
