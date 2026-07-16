import type { TransfersLoader } from "~/client/types/transfersLoader";

type TransferAccount = TransfersLoader["transferAccounts"]["data"][number];

const STATUS_BADGE: Record<string, "amber" | "emerald" | "neutral" | "info"> =
  {
    pending: "amber",
    pendent: "amber",
    pendente: "amber",
    transferred: "emerald",
    transferido: "emerald",
    paid: "emerald",
    received: "emerald",
    processing: "info",
  };

function formatCurrency(value: number | string | null | undefined): string {
  const numberValue = Number(value ?? 0);
  if (!Number.isFinite(numberValue)) return "R$ 0,00";

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.split(" ")[0] || "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatStatus(status: string): string {
  const normalized = status.toLowerCase();
  const statusMap: Record<string, string> = {
    pending: "Pendente",
    pendent: "Pendente",
    pendente: "Pendente",
    transferred: "Transferido",
    transferido: "Transferido",
    paid: "Transferido",
    received: "Transferido",
    processing: "Processando",
  };

  return statusMap[normalized] ?? status;
}

function getStatusVariant(status: string) {
  return STATUS_BADGE[status.toLowerCase()] ?? "neutral";
}

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function getPixLabel(account: TransferAccount): string {
  if (account.pixKey) return account.pixKey;
  if (account.name) return account.name;
  if (account.bank) return account.bank;
  return account.id;
}

export {
  formatCurrency,
  formatDate,
  formatStatus,
  getPixLabel,
  getStatusVariant,
  getTodayISO,
};
export type { TransferAccount };
