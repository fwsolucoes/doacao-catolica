function formatPhone(raw: string | null): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");

  // Brazilian: +55 + DDD (2) + number (8 or 9 digits) = 12 or 13 digits
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    const ddd = digits.slice(2, 4);
    const number = digits.slice(4);
    if (number.length === 9) {
      return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5)}`;
    }
    return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
  }

  return raw;
}

export { formatPhone };
