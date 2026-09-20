import { Input } from "@venore/plugin-sdk/ui";
import { Textarea } from "@venore/plugin-sdk/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@venore/plugin-sdk/ui";

export function GalleryFields({
  defaultTitle = "",
  defaultCategory = "",
  defaultDescription = "",
  defaultStatus = "draft",
}: {
  defaultTitle?: string;
  defaultCategory?: string;
  defaultDescription?: string;
  defaultStatus?: string;
}) {
  return (
    <>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Título
        <Input name="title" defaultValue={defaultTitle} placeholder="ex.: Festa junina 2026" required />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Categoria (opcional)
        <Input name="category" defaultValue={defaultCategory} placeholder="ex.: Eventos" />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Descrição (opcional)
        <Textarea name="description" defaultValue={defaultDescription} rows={3} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Status
        <Select name="status" defaultValue={defaultStatus}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="published">Publicada</SelectItem>
          </SelectContent>
        </Select>
      </label>
    </>
  );
}
