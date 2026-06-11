export function formatCurrency(value: string | null | undefined): string {
  if (!value) return "R$ 0,00";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
