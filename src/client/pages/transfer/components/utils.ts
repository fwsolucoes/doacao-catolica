import type { TransfersLoader } from "~/client/types/transfersLoader";

type TransferAccount = TransfersLoader["transferAccounts"]["data"][number];

const STATUS_BADGE: Record<
  string,
  "amber" | "emerald" | "neutral" | "info" | "danger"
> = {
  pending: "amber",
  pendent: "amber",
  pendente: "amber",
  created: "info",
  transferred: "emerald",
  transferido: "emerald",
  paid: "emerald",
  received: "emerald",
  processing: "info",
  failed: "danger",
  falhou: "danger",
  cancelled: "danger",
  canceled: "danger",
  cancelado: "danger",
  rejected: "danger",
  rejeitado: "danger",
  error: "danger",
};

function formatCurrency(value: number | string | null | undefined): string {
  const numberValue = Number(value ?? 0);
  if (!Number.isFinite(numberValue)) return "R$ 0,00";

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatStatus(status: string): string {
  const normalized = status.toLowerCase();
  const statusMap: Record<string, string> = {
    created: "Aguardando transferência",
    pending: "Pendente",
    pendent: "Pendente",
    pendente: "Pendente",
    transferred: "Transferido",
    transferido: "Transferido",
    paid: "Transferido",
    received: "Transferido",
    processing: "Processando",
    failed: "Falhou",
    falhou: "Falhou",
    cancelled: "Cancelado",
    canceled: "Cancelado",
    cancelado: "Cancelado",
    rejected: "Rejeitado",
    rejeitado: "Rejeitado",
    error: "Erro",
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
  formatStatus,
  getPixLabel,
  getStatusVariant,
  getTodayISO,
};
export type { TransferAccount };
