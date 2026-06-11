export function formatCurrency(value: string | null | undefined): string {
  if (value == null || value === "") return "R$ 0,00";
  const num = Number(value);
  if (!Number.isFinite(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
