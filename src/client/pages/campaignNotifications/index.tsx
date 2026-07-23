import {
  CheckCircle2,
  Clock,
  Download,
  Mail,
  MessageSquare,
  Search,
  Send,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLoaderData } from "react-router";
import { cn } from "~/lib/utils";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Table } from "~/client/components/ui/table";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import type { CampaignNotificationsLoader } from "~/client/types/campaignNotificationsLoader";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";

type MetricColor = Parameters<typeof Card.MetricHeader>[0]["color"];

type StatCardItem = {
  label: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: MetricColor;
};

// known values: "delivered" | "sent" | "failed"
const STATUS_BADGE: Record<
  string,
  { variant: "emerald" | "info" | "danger" | "warning" | "neutral"; label: string }
> = {
  success: { variant: "emerald", label: "Entregue" },
  awaiting_confirmation: { variant: "info", label: "Enviado" },
  error: { variant: "danger", label: "Falha" },
  not_send: { variant: "neutral", label: "Não enviado" },
  blocked: { variant: "warning", label: "Bloqueado" },
};

// known values: "whatsapp" | "sms" | "email"
const CHANNEL_STYLE: Record<string, { label: string; className: string }> = {
  whatsapp: { label: "WhatsApp", className: "bg-emerald-100 text-emerald-700" },
  sms: { label: "SMS", className: "bg-blue-100 text-blue-700" },
  email: { label: "E-mail", className: "bg-amber-100 text-amber-700" },
};

function ChannelBadge({ channel }: { channel: string }) {
  const style = CHANNEL_STYLE[channel] ?? {
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

function StatCard({ label, value, subtitle, icon, color }: StatCardItem) {
  return (
    <Card.Root className="gap-0 p-0">
      <div className="px-7 pb-3 pt-7">
        <Card.MetricHeader label={label} icon={icon} color={color} />
      </div>
      <div className="flex flex-col gap-0.5 px-7 pb-7">
        <Card.MetricValue>{value}</Card.MetricValue>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Card.Root>
  );
}

function getContact(notification: {
  channel: string;
  customerPhone: string | null;
  customerEmail: string | null;
}) {
  if (notification.channel === "email") return notification.customerEmail ?? "-";
  return notification.customerPhone ?? "-";
}

function CampaignNotificationsPage() {
  const { notifications } = useLoaderData<CampaignNotificationsLoader>();

  const total = notifications.meta.totalItems;
  const delivered = notifications.data.filter(
    (n) => n.logType === "success",
  ).length;
  const pending = notifications.data.filter(
    (n) => n.logType === "awaiting_confirmation",
  ).length;
  const failed = notifications.data.filter(
    (n) => n.logType === "error",
  ).length;

  const statCards: StatCardItem[] = [
    {
      label: "Total",
      value: total,
      subtitle: "Notificações enviadas",
      icon: Send,
      color: "info",
    },
    {
      label: "Entregues",
      value: delivered,
      subtitle: "Confirmadas pelo canal",
      icon: CheckCircle2,
      color: "success",
    },
    {
      label: "Pendentes",
      value: pending,
      subtitle: "Aguardando confirmação",
      icon: Clock,
      color: "warning",
    },
    {
      label: "Falhas",
      value: failed,
      subtitle: "Necessitam atenção",
      icon: XCircle,
      color: "danger",
    },
  ];

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
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
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
            {notifications.data.map((item) => {
              const statusConfig = STATUS_BADGE[item.logType];
              return (
                <Table.Row key={item.uuid}>
                  <Table.Cell className="font-semibold">
                    {item.customerName ?? "-"}
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {getContact(item)}
                  </Table.Cell>
                  <Table.Cell>
                    <ChannelBadge channel={item.channel} />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">
                        {NOTIFICATION_TYPES[item.notificationType] ?? item.notificationType}
                      </span>
                      {item.logType === "error" && item.response && (
                        <span className="text-xs text-destructive">
                          {item.response}
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span>{item.createdAt}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.createdAtTime}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={statusConfig?.variant ?? "neutral"}>
                      {statusConfig?.label ?? item.logType}
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

export { CampaignNotificationsPage };
