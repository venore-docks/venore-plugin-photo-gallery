// "2026-06-14" -> "14/06/2026" sem passar por Date (fuso não desloca o dia).
export function formatEventDate(value: string): string {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function formatPhotoCount(count: number): string {
  return count === 1 ? "1 foto" : `${count} fotos`;
}
