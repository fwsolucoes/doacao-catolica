import {
  CheckCircle2,
  Clock,
  // Download,
  Mail,
  MessageSquare,
  Send,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLoaderData } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import type { CampaignNotificationsLoader } from "~/client/types/campaignNotificationsLoader";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import { FilterBar } from "./components/filterBar";

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
  {
    variant: "success" | "info" | "danger" | "warning" | "neutral";
    label: string;
  }
> = {
  success: { variant: "success", label: "Entregue" },
  awaiting_confirmation: { variant: "info", label: "Enviado" },
  error: { variant: "danger", label: "Falha" },
  not_send: { variant: "neutral", label: "Não enviado" },
  blocked: { variant: "warning", label: "Bloqueado" },
};

// known values: "whatsapp" | "sms" | "email"
const CHANNEL_BADGE: Record<
  string,
  { variant: "success" | "navy" | "amber"; label: string }
> = {
  whatsapp: { variant: "success", label: "WhatsApp" },
  sms: { variant: "navy", label: "SMS" },
  email: { variant: "amber", label: "E-mail" },
};

function ChannelBadge({ channel }: { channel: string }) {
  const config = CHANNEL_BADGE[channel];
  return (
    <Badge variant={config?.variant ?? "neutral"}>
      {channel === "whatsapp" && <WhatsAppIcon size={14} data-icon="inline-start" />}
      {channel === "sms" && <MessageSquare size={14} data-icon="inline-start" />}
      {channel === "email" && <Mail size={14} data-icon="inline-start" />}
      {config?.label ?? channel}
    </Badge>
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
  if (notification.channel === "email")
    return notification.customerEmail ?? "-";
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
  const failed = notifications.data.filter((n) => n.logType === "error").length;

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
        {/* TODO: implementar rota de exportação
        <Button>
          <Download size={18} />
          Exportar
        </Button> */}
      </div>

      <FilterBar />

      <div className="grid grid-cols-4 gap-5">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <Card.Root className="gap-4 p-7">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Cliente</Table.Head>
              <Table.Head>Contato</Table.Head>
              <Table.Head>Canal</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Mensagem</Table.Head>
              <Table.Head>Data/Hora</Table.Head>
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
                    <Badge variant={statusConfig?.variant ?? "neutral"}>
                      {statusConfig?.label ?? item.logType}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">
                        {NOTIFICATION_TYPES[item.notificationType] ??
                          item.notificationType}
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
                </Table.Row>
              );
            })}
            {!notifications.data.length && <Table.Empty />}
          </Table.Body>
        </Table.Root>

        <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <TablePagination
            currentPage={notifications.meta.page}
            totalPages={notifications.meta.totalPages}
          />
        </Card.Footer>
      </Card.Root>
    </div>
  );
}

export { CampaignNotificationsPage };
