import {
  Bell,
  CheckCircle2,
  Clock,
  Download,
  Ellipsis,
  Mail,
  MessageSquare,
  Plus,
  Radio,
  Search,
  Send,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { Tabs } from "radix-ui";
import { cn } from "~/lib/utils";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Switch } from "~/client/components/ui/switch";
import { Table } from "~/client/components/ui/table";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";

type Channel = "email" | "whatsapp" | "sms" | "ligacao";
type PaymentMethod = "pix" | "boleto" | "cartao";

type BillingRule = {
  id: string;
  name: string;
  description: string;
  channels: Channel[];
  paymentMethods: PaymentMethod[];
  active: boolean;
};

const BILLING_RULES: BillingRule[] = [
  {
    id: "1",
    name: "Cobrança - 3 dias antes",
    description: "Lembrete X dias antes do vencimento (3 dias)",
    channels: ["email", "whatsapp"],
    paymentMethods: ["pix", "boleto"],
    active: true,
  },
  {
    id: "2",
    name: "Cobrança - 1º aviso",
    description: "Cobrança X dias após vencimento (no dia)",
    channels: ["email", "whatsapp", "sms"],
    paymentMethods: ["pix", "cartao", "boleto"],
    active: true,
  },
  {
    id: "3",
    name: "Cobrança - 2º aviso",
    description: "Cobrança X dias após vencimento (3 dias)",
    channels: ["whatsapp", "sms"],
    paymentMethods: ["pix", "boleto"],
    active: true,
  },
  {
    id: "4",
    name: "Cobrança - 3º aviso",
    description: "Cobrança X dias após vencimento (7 dias)",
    channels: ["email", "whatsapp", "ligacao"],
    paymentMethods: ["pix", "cartao", "boleto"],
    active: false,
  },
];

const CHANNEL_BADGE: Record<Channel, { label: string; className: string }> = {
  email: { label: "E-mail", className: "bg-[#ede0ff] text-[#6b21a8]" },
  whatsapp: { label: "WhatsApp", className: "bg-[#d4f5e2] text-[#1f7a4d]" },
  sms: { label: "SMS", className: "bg-[#dbe8ff] text-[#1e40af]" },
  ligacao: { label: "Ligação", className: "bg-[#fef3c6] text-[#bb4d00]" },
};

const PAYMENT_BADGE: Record<
  PaymentMethod,
  { label: string; className: string }
> = {
  pix: { label: "Pix", className: "bg-[#cbfbf1] text-[#00786f]" },
  boleto: { label: "Boleto", className: "bg-[#e2e8f0] text-[#314158]" },
  cartao: { label: "Cartão", className: "bg-[#e0e7ff] text-[#432dd7]" },
};

function ChannelBadge({ channel }: { channel: Channel }) {
  const style = CHANNEL_BADGE[channel];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}

function PaymentBadge({ method }: { method: PaymentMethod }) {
  const style = PAYMENT_BADGE[method];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  iconBg,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: number;
  subtitle: string;
  iconBg: string;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <Card.Root className="gap-0 p-0">
      <div className="flex items-center justify-between px-7 pb-3 pt-7">
        <span className="text-sm font-semibold text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-7 pb-7">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Card.Root>
  );
}

function BillingRulesTab() {
  const activeCount = BILLING_RULES.filter((r) => r.active).length;
  const inactiveCount = BILLING_RULES.filter((r) => !r.active).length;
  const channelSet = new Set(BILLING_RULES.flatMap((r) => r.channels));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          label="Total"
          value={BILLING_RULES.length}
          subtitle="Templates cadastrados"
          iconBg="bg-blue-100"
          icon={Send}
          iconColor="text-blue-600"
        />
        <StatCard
          label="Ativas"
          value={activeCount}
          subtitle="Em operação"
          iconBg="bg-emerald-100"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Inativas"
          value={inactiveCount}
          subtitle="Pausadas"
          iconBg="bg-rose-100"
          icon={XCircle}
          iconColor="text-rose-500"
        />
        <StatCard
          label="Canais"
          value={channelSet.size}
          subtitle="Canais utilizados"
          iconBg="bg-purple-100"
          icon={Radio}
          iconColor="text-purple-600"
        />
      </div>

      <Card.Root className="gap-0 p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-5">
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-semibold text-foreground">
              Réguas de cobrança
            </p>
            <p className="text-xs text-muted-foreground">
              Mensagens automáticas antes e após o vencimento.
            </p>
          </div>
          <Button>
            <Plus size={18} />
            Nova régua de cobrança
          </Button>
        </div>

        <div className="p-7">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nome</Table.Head>
                <Table.Head>Canais</Table.Head>
                <Table.Head>Formas de pagamento</Table.Head>
                <Table.Head className="w-28">Ativo</Table.Head>
                <Table.Head className="w-16 text-right">Ações</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {BILLING_RULES.map((rule) => (
                <Table.Row key={rule.id}>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{rule.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {rule.description}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.channels.map((ch) => (
                        <ChannelBadge key={ch} channel={ch} />
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.paymentMethods.map((m) => (
                        <PaymentBadge key={m} method={m} />
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Switch checked={rule.active} />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-xl"
                      >
                        <Ellipsis size={18} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </Card.Root>
    </div>
  );
}

const HISTORY_CHANNEL_STYLE: Record<string, { label: string; className: string }> = {
  whatsapp: { label: "WhatsApp", className: "bg-[#d4f5e2] text-[#1f7a4d]" },
  sms: { label: "SMS", className: "bg-[#dbe8ff] text-[#1447e6]" },
  email: { label: "E-mail", className: "bg-[#fef3c6] text-[#bb4d00]" },
};

const HISTORY_STATUS_BADGE: Record<
  string,
  { variant: "emerald" | "info" | "danger" | "neutral"; label: string }
> = {
  delivered: { variant: "emerald", label: "Entregue" },
  sent: { variant: "info", label: "Enviado" },
  failed: { variant: "danger", label: "Falha" },
};

type NotificationHistory = {
  id: string;
  customerName: string;
  contact: string;
  channel: string;
  message: string;
  errorMessage?: string;
  date: string;
  time: string;
  status: string;
};

const NOTIFICATION_HISTORY: NotificationHistory[] = [
  {
    id: "1",
    customerName: "João Silva",
    contact: "(11) 98765-4321",
    channel: "whatsapp",
    message: "Cobrança - 3 dias antes",
    date: "19/05/2026",
    time: "05:00:00",
    status: "delivered",
  },
  {
    id: "2",
    customerName: "Maria Santos",
    contact: "(21) 99123-4567",
    channel: "whatsapp",
    message: "Agradecimento (recorrência)",
    date: "20/05/2026",
    time: "11:30:00",
    status: "delivered",
  },
  {
    id: "3",
    customerName: "Pedro Oliveira",
    contact: "(31) 98888-7777",
    channel: "sms",
    message: "Cobrança - 2º aviso",
    date: "21/05/2026",
    time: "06:15:00",
    status: "delivered",
  },
  {
    id: "4",
    customerName: "João Silva",
    contact: "joao.silva@email.com",
    channel: "email",
    message: "Cobrança - 3 dias antes",
    date: "21/05/2026",
    time: "07:00:00",
    status: "sent",
  },
  {
    id: "5",
    customerName: "Ana Costa",
    contact: "(41) 97777-6666",
    channel: "sms",
    message: "Cobrança - 1º aviso",
    errorMessage: "Número de telefone inválido",
    date: "22/05/2026",
    time: "08:00:00",
    status: "failed",
  },
];

function HistoryChannelBadge({ channel }: { channel: string }) {
  const style = HISTORY_CHANNEL_STYLE[channel] ?? {
    label: channel,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        style.className,
      )}
    >
      {channel === "whatsapp" && <WhatsAppIcon size={14} />}
      {channel === "sms" && <MessageSquare size={14} />}
      {channel === "email" && <Mail size={14} />}
      {style.label}
    </span>
  );
}

function OtherMessagesTab() {
  const total = NOTIFICATION_HISTORY.length;
  const delivered = NOTIFICATION_HISTORY.filter(
    (n) => n.status === "delivered",
  ).length;
  const pending = NOTIFICATION_HISTORY.filter(
    (n) => n.status === "sent",
  ).length;
  const failed = NOTIFICATION_HISTORY.filter(
    (n) => n.status === "failed",
  ).length;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Histórico de notificações
          </h1>
          <p className="text-muted-foreground">
            Acompanhe todas as notificações enviadas.
          </p>
        </div>
        <Button>
          <Download size={18} />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <StatCard
          label="Total"
          value={total}
          subtitle="Notificações enviadas"
          iconBg="bg-blue-100"
          icon={Send}
          iconColor="text-blue-600"
        />
        <StatCard
          label="Entregues"
          value={delivered}
          subtitle="Confirmadas pelo canal"
          iconBg="bg-emerald-100"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Pendentes"
          value={pending}
          subtitle="Aguardando confirmação"
          iconBg="bg-amber-100"
          icon={Clock}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Falhas"
          value={failed}
          subtitle="Necessitam atenção"
          iconBg="bg-rose-100"
          icon={XCircle}
          iconColor="text-rose-500"
        />
      </div>

      <Card.Root className="gap-4 p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 max-w-lg flex-1">
            <Input
              leftIcon={Search}
              placeholder="Buscar por cliente, telefone, e-mail ou mensagem..."
            />
          </div>
          <Button variant="outline">
            <SlidersHorizontal size={18} />
            Filtros
          </Button>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Cliente</Table.Head>
              <Table.Head>Contato</Table.Head>
              <Table.Head>Canal</Table.Head>
              <Table.Head>Mensagem</Table.Head>
              <Table.Head>Data/Hora</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {NOTIFICATION_HISTORY.map((item) => {
              const statusConfig = HISTORY_STATUS_BADGE[item.status];
              return (
                <Table.Row key={item.id}>
                  <Table.Cell className="font-semibold">
                    {item.customerName}
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {item.contact}
                  </Table.Cell>
                  <Table.Cell>
                    <HistoryChannelBadge channel={item.channel} />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{item.message}</span>
                      {item.status === "failed" && item.errorMessage && (
                        <span className="text-xs text-destructive">
                          {item.errorMessage}
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span>{item.date}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={statusConfig?.variant ?? "neutral"}>
                      {statusConfig?.label ?? item.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card.Root>
    </div>
  );
}

function MessageRulesPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Automação de notificações
        </h1>
        <p className="text-muted-foreground">
          Configure réguas de cobrança e outras mensagens automáticas.
        </p>
      </div>

      <Tabs.Root defaultValue="billing">
        <Tabs.List className="mb-5 inline-flex gap-1.5 rounded-2xl border border-border bg-muted/60 p-1.5">
          <Tabs.Trigger
            value="billing"
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
              "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
              "hover:text-foreground",
            )}
          >
            <Bell size={16} />
            Réguas de cobrança
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold">
              {BILLING_RULES.length}
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="other"
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
              "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
              "hover:text-foreground",
            )}
          >
            <MessageSquare size={16} />
            Outras mensagens
            <span className="rounded-full bg-muted-foreground/15 px-2 py-0.5 text-xs font-semibold">
              5
            </span>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="billing">
          <BillingRulesTab />
        </Tabs.Content>
        <Tabs.Content value="other">
          <OtherMessagesTab />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export { MessageRulesPage };
