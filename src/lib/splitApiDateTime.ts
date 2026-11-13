type ApiDateTimeParts = {
  /** DD/MM/YYYY */
  date: string;
  /** HH:mm */
  time: string;
  /** YYYY-MM-DD — formato aceito por <input type="date"> */
  isoDate: string;
};

// "2026-10-01 08:00:00", "2026-10-01T08:00:00" ou "2026-10-01" — sem fuso, exibido como veio.
const NAIVE_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::\d{2})?)?$/;

const SAO_PAULO_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/**
 * Quebra uma data/hora da API em partes prontas para exibição.
 * Strings ISO com fuso (ex.: "2026-10-01T11:00:00.000000Z") são convertidas para
 * America/Sao_Paulo; strings sem fuso ("Y-m-d H:i:s") são mantidas como vieram.
 */
function splitApiDateTime(value: string | null | undefined): ApiDateTimeParts | null {
  if (!value) return null;

  const naive = value.trim().match(NAIVE_DATE_TIME);
  if (naive) {
    const [, year, month, day, hour = "00", minute = "00"] = naive;
    return {
      date: `${day}/${month}/${year}`,
      time: `${hour}:${minute}`,
      isoDate: `${year}-${month}-${day}`,
    };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  const parts = Object.fromEntries(
    SAO_PAULO_FORMATTER.formatToParts(parsed).map((part) => [part.type, part.value]),
  );

  return {
    date: `${parts.day}/${parts.month}/${parts.year}`,
    time: `${parts.hour}:${parts.minute}`,
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

export { splitApiDateTime };
export type { ApiDateTimeParts };
