import { format } from "date-fns";
import { tr } from "date-fns/locale";

type DateLike = Date | { toDate: () => Date } | string | number | null | undefined;

export function formatDate(value: DateLike, pattern = "d MMMM yyyy") {
  if (!value) return "";
  const date = value instanceof Date ? value : typeof value === "object" && "toDate" in value ? value.toDate() : new Date(value);
  return format(date, pattern, { locale: tr });
}
