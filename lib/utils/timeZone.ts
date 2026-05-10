const torontoTimeZone = "America/Toronto";

function partsToRecord(parts: Intl.DateTimeFormatPart[]) {
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
}

function timeZoneOffsetMs(date: Date, timeZone = torontoTimeZone) {
  const parts = partsToRecord(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date)
  );

  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
  return asUtc - date.getTime();
}

/** Parses an HTML datetime-local value as America/Toronto wall-clock time. */
export function parseTorontoDateTime(value: string, fallback = new Date()) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return fallback;

  const [, year, month, day, hour, minute] = match;
  const utcGuess = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), 0);
  let result = new Date(utcGuess - timeZoneOffsetMs(new Date(utcGuess)));
  result = new Date(utcGuess - timeZoneOffsetMs(result));
  return Number.isNaN(result.getTime()) ? fallback : result;
}

/** Formats a Date for an HTML datetime-local input in America/Toronto time. */
export function formatTorontoDateTimeInput(date?: Date | null) {
  if (!date) return "";
  const parts = partsToRecord(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: torontoTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date)
  );

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export const scheduleTimeZoneLabel = "America/Toronto";
