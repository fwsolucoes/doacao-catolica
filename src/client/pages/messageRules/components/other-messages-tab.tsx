import { CheckCircle2, Clock, Download, Search, Send, SlidersHorizontal, XCircle } from "lucide-react";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Table } from "~/client/components/ui/table";
import { NOTIFICATION_HISTORY } from "../constants";
import { HistoryChannelBadge } from "./badges";
import { StatCard } from "./stat-card";

const STATUS_BADGE: Record<
  string,
  { variant: "emerald" | "info" | "danger" | "neutral"; label: string }
> = {
  delivered: { variant: "emerald", label: "Entregue" },
  sent: { variant: "info", label: "Enviado" },
  failed: { variant: "danger", label: "Falha" },
};

function OtherMessagesTab() {
  const total = NOTIFICATION_HISTORY.length;
  const delivered = NOTIFICATION_HISTORY.filter((n) => n.status === "delivered").length;
  const pending = NOTIFICATION_HISTORY.filter((n) => n.status === "sent").length;
  const failed = NOTIFICATION_HISTORY.filter((n) => n.status === "failed").length;

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
              const statusConfig = STATUS_BADGE[item.status];
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

export { OtherMessagesTab };
