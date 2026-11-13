import { Input } from "@venore/plugin-sdk/ui";
import { Textarea } from "@venore/plugin-sdk/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@venore/plugin-sdk/ui";

export function GalleryFields({
  defaultTitle = "",
  defaultCategory = "",
  defaultDescription = "",
  defaultEventDate = "",
  defaultStatus = "draft",
}: {
  defaultTitle?: string;
  defaultCategory?: string;
  defaultDescription?: string;
  defaultEventDate?: string;
  defaultStatus?: string;
}) {
  return (
    <>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Título
        <Input name="title" defaultValue={defaultTitle} placeholder="ex.: Festa junina 2026" maxLength={200} required />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Categoria (opcional)
          <Input name="category" defaultValue={defaultCategory} placeholder="ex.: Eventos" maxLength={80} />
        </label>

        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Data do evento (opcional)
          <Input name="eventDate" type="date" defaultValue={defaultEventDate} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Descrição (opcional)
        <Textarea name="description" defaultValue={defaultDescription} rows={3} maxLength={4000} />
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
