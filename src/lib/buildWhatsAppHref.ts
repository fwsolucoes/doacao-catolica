function buildWhatsAppHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const number = digits.startsWith("55") ? digits : `55${digits}`;
  if (number.length < 12 || number.length > 13) return null;
  return `https://wa.me/${number}`;
}

export { buildWhatsAppHref };
