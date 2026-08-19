import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Mail,
  RefreshCw,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router";
import { CancelPaymentDialog } from "./cancelPaymentDialog";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Dialog, DialogContent } from "~/client/components/ui/dialog";
import { Select } from "~/client/components/ui/select";
import { Separator } from "~/client/components/ui/separator";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { cn } from "~/lib/utils";
import type { DonationsLoader } from "~/client/types/paymentStatementsLoader";

type Payment = DonationsLoader["payments"]["data"][number];
type Tab = "details" | "notifications";

type PaymentDetailDialogProps = {
  payment: Payment | null;
  onClose: () => void;
};

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral"
  | "violet"
  | "emerald"
  | "navy"
  | "amber";

const STATUS_BADGE: Record<string, BadgeVariant> = {
  "Disponível para saque": "emerald",
  "Pagamento confirmado": "emerald",
  Recebido: "emerald",
  "Aguardando pagamento": "amber",
  Estornado: "neutral",
  Cancelado: "danger",
  Vencido: "danger",
  "Falha no pagamento": "danger",
  Excluído: "danger",
  Processando: "info",
};

const ORIGIN_BADGE: Record<string, BadgeVariant> = {
  Recorrente: "violet",
  Pontual: "navy",
};

const PAYMENT_TYPE_BADGE: Record<string, BadgeVariant> = {
  Pix: "emerald",
  "Pix automático": "navy",
  Boleto: "amber",
  "Cartão de crédito": "navy",
};

const NOTIFICATION_TYPE_LABEL: Record<string, string> = {
  payment_before_due_date: "Lembrete de vencimento",
  payment_after_due_date: "Aviso de atraso",
  payment_confirmed: "Confirmação da doação",
  donation_confirmed: "Confirmação da doação",
  invoice_generated: "Fatura gerada",
  payment_received: "Aviso de recebimento",
  receipt_sent: "Recibo enviado",
  second_charge_attempt: "Segunda tentativa de cobrança",
  third_charge_attempt: "Terceira tentativa de cobrança",
};

const LOG_TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  success: {
    label: "Entregue",
    icon: CheckCircle2,
    className: "bg-[#d4f5e2] text-[#1f7a4d]",
  },
  awaiting_confirmation: {
    label: "Aberto",
    icon: CheckCircle2,
    className: "bg-[#d4f5e2] text-[#1f7a4d]",
  },
  error: {
    label: "Falhou",
    icon: XCircle,
    className: "bg-destructive/15 text-destructive",
  },
  not_send: {
    label: "Não enviado",
    icon: XCircle,
    className: "bg-muted text-muted-foreground",
  },
  blocked: {
    label: "Bloqueado",
    icon: XCircle,
    className: "bg-muted text-muted-foreground",
  },
};

function getInitials(name: string): string {
  const words = name.split(" ").filter(Boolean);
  const parts = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return parts.map((w) => w[0].toUpperCase()).join("");
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  count?: number;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "h-auto gap-2.5 rounded-xl px-3.5 py-1.5 text-base font-semibold",
        active
          ? "bg-[#e6e6ed] text-foreground hover:bg-[#e6e6ed] hover:text-foreground"
          : "text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
      )}
    >
      <Icon size={20} className="shrink-0" />
      {label}
      {count !== undefined && (
        <span className="rounded-full bg-muted-foreground/15 px-2.5 py-0.5 text-xs">
          {count}
        </span>
      )}
    </Button>
  );
}

type NotificationItem = {
  uuid: string;
  channel: string;
  notificationType: string;
  logType: string;
  createdAt: string;
  createdAtTime: string;
};

function NotificationCard({ item }: { item: NotificationItem }) {
  const logConfig = LOG_TYPE_CONFIG[item.logType];
  const StatusIcon = logConfig?.icon ?? CheckCircle2;
  const label =
    NOTIFICATION_TYPE_LABEL[item.notificationType] ?? item.notificationType;

  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-border p-3.5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        {item.channel === "whatsapp" ? (
          <WhatsAppIcon size={20} className="text-[#25d366]" />
        ) : (
          <Mail size={20} className="text-muted-foreground" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-base font-semibold text-foreground">{label}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={14} />
          {item.createdAt} · {item.createdAtTime}
        </span>
      </div>

      {logConfig && (
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${logConfig.className}`}
        >
          <StatusIcon size={14} />
          {logConfig.label}
        </div>
      )}
    </div>
  );
}

function PaymentDetailDialog({ payment, onClose }: PaymentDetailDialogProps) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const fetcher = useFetcher<NotificationItem[]>();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [channelFilter, setChannelFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const closeCancelDialog = useCallback(() => setShowCancelDialog(false), []);

  useEffect(() => {
    if (payment && campaignId) {
      fetcher.load(
        `/campaign/${campaignId}/api/payment-notifications/${payment.id}`,
      );
    }
  }, [payment?.id, campaignId]);

  const notifications: NotificationItem[] = Array.isArray(fetcher.data)
    ? fetcher.data
    : [];

  const filteredNotifications =
    channelFilter === "all"
      ? notifications
      : notifications.filter((n) => n.channel === channelFilter);

  function handleCopyLink() {
    if (!payment) return;
    navigator.clipboard.writeText(payment.paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
      setActiveTab("details");
      setChannelFilter("all");
    }
  }

  return (
    <>
    <Dialog open={!!payment} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
        {/* Header */}
        <div className="flex flex-col border-b border-border px-7 py-6 pr-16 text-center sm:text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <Avatar className="h-13 w-13 shrink-0">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {payment ? getInitials(payment.customerName) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-0.5">
                <h2 className="truncate text-xl font-semibold tracking-tight">
                  {payment?.customerName}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-0.5 text-xs text-muted-foreground">
                  {payment?.customerDocument && (
                    <span className="font-mono">
                      {payment.customerDocument}
                    </span>
                  )}
                  {payment?.customerPhone && (
                    <>
                      <span className="hidden sm:inline">·</span>
                      <span>{payment.customerPhone}</span>
                    </>
                  )}
                  {payment?.customerEmail && (
                    <>
                      <span className="hidden sm:inline">·</span>
                      <span className="break-all">{payment.customerEmail}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {payment?.amount}
              </div>
              {payment && (
                <Badge
                  className="mt-1"
                  variant={STATUS_BADGE[payment.status] ?? "neutral"}
                >
                  {payment.status}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {payment && (
          <>
            {/* Alert banner */}
            {payment.alertMessage && (
              <div className="flex items-start gap-3.5 border-b border-destructive/30 bg-destructive/10 px-7 py-3.5">
                <AlertTriangle
                  size={24}
                  className="mt-0.5 shrink-0 text-destructive"
                />
                <p className="text-sm font-semibold leading-6 text-destructive">
                  {payment.alertMessage}
                </p>
              </div>
            )}

            {/* Tab buttons */}
            <div className="px-7 pt-5">
              <div className="flex w-fit items-center gap-1 rounded-[13px] border border-border bg-muted/60 p-1.5">
                <TabButton
                  active={activeTab === "details"}
                  onClick={() => setActiveTab("details")}
                  icon={FileText}
                  label="Detalhes"
                />
                <TabButton
                  active={activeTab === "notifications"}
                  onClick={() => setActiveTab("notifications")}
                  icon={Mail}
                  label="Notificações"
                  count={notifications.length}
                />
              </div>
            </div>

            {/* Detalhes */}
            {activeTab === "details" && (
              <div className="max-h-[65vh] space-y-7 overflow-y-auto px-7 py-6">
                <section className="grid grid-cols-2 gap-x-7 gap-y-5 sm:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Forma de pagamento
                    </div>
                    <div className="pt-0.5">
                      <Badge
                        variant={
                          PAYMENT_TYPE_BADGE[payment.paymentType] ?? "neutral"
                        }
                      >
                        {payment.paymentType}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Tipo
                    </div>
                    <div className="pt-0.5">
                      <Badge
                        variant={ORIGIN_BADGE[payment.origin] ?? "neutral"}
                      >
                        {payment.origin === "Recorrente" && (
                          <RefreshCw size={11} data-icon="inline-start" />
                        )}
                        {payment.origin}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Valor
                    </div>
                    <div className="text-base font-semibold text-foreground">
                      {payment.amount}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Vencimento
                    </div>
                    <div className="text-base font-semibold text-foreground">
                      {payment.dueDate}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Pagamento
                    </div>
                    <div className="text-base font-semibold text-foreground">
                      {payment.paidDate ?? "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      ID da transação
                    </div>
                    <div className="pt-1.5">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {payment.id}
                      </span>
                    </div>
                  </div>
                </section>

                <Separator />

                <section className="space-y-3.5">
                  <h3 className="text-base font-semibold">Link de pagamento</h3>
                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="outline"
                      className="h-10 gap-2 rounded-xl px-3.5 text-xs font-semibold"
                      onClick={handleCopyLink}
                    >
                      <Copy className="h-5 w-5" />
                      {copied ? "Copiado!" : "Copiar link"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 gap-2 rounded-xl px-3.5 text-xs font-semibold"
                      asChild
                    >
                      <a
                        href={payment.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Acessar
                      </a>
                    </Button>
                  </div>
                  <div className="truncate rounded-xl border bg-muted/30 px-3.5 py-2.5 font-mono text-xs text-muted-foreground">
                    {payment.paymentLink}
                  </div>
                </section>
              </div>
            )}

            {/* Notificações */}
            {activeTab === "notifications" && (
              <div className="flex max-h-[65vh] flex-col overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border px-7 py-3.5 backdrop-blur-sm">
                  <span className="text-xs">
                    <span className="font-semibold text-foreground">
                      {filteredNotifications.length}
                    </span>
                    <span className="text-muted-foreground"> notificações</span>
                  </span>
                  <Select.Root
                    value={channelFilter}
                    onValueChange={setChannelFilter}
                  >
                    <Select.Trigger className="h-9.5 min-h-0 w-40 text-xs">
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="all">Todos os canais</Select.Item>
                      <Select.Item value="email">E-mail</Select.Item>
                      <Select.Item value="whatsapp">WhatsApp</Select.Item>
                      <Select.Item value="sms">SMS</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>

                <div className="flex flex-col gap-3 px-7 py-5">
                  {fetcher.state === "loading" ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Carregando...
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Nenhuma notificação encontrada
                    </div>
                  ) : (
                    filteredNotifications.map((item) => (
                      <NotificationCard key={item.uuid} item={item} />
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border bg-muted/30 px-7 py-3.5">
          {payment?.status !== "Excluído" && (
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-xl border-destructive/30 px-3.5 text-xs text-destructive hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              onClick={() => setShowCancelDialog(true)}
            >
              <XCircle className="h-5 w-5" />
              Cancelar pagamento
            </Button>
          )}
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl px-3.5 text-xs"
          >
            <CheckCircle2 className="h-5 w-5" />
            Baixa manual
          </Button>
          <Button className="h-10 gap-2 rounded-xl bg-[#25d366] px-3.5 text-xs text-white hover:bg-[#20bd5a]">
            <WhatsAppIcon size={20} />
            Enviar lembrete
          </Button>
          <Button className="h-10 rounded-xl px-3.5 text-xs" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <CancelPaymentDialog
      payment={showCancelDialog ? payment : null}
      onClose={closeCancelDialog}
    />
    </>
  );
}

export { PaymentDetailDialog };
