import {
  CheckCircle2,
  Clock,
  Ban,
  CircleX,
  Search,
  ExternalLink,
  History,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import { cn } from "~/lib/utils";

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "neutral"
  | "emerald"
  | "amber";

const STATUS_BADGE: Record<
  string,
  { variant: BadgeVariant; label: string }
> = {
  authorized: { variant: "emerald", label: "Autorizado" },
  pending: { variant: "amber", label: "Pendente" },
  canceled: { variant: "neutral", label: "Cancelado" },
  rejected: { variant: "danger", label: "Recusado" },
};

type StatCardItem = {
  label: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const STAT_CARDS: StatCardItem[] = [
  {
    label: "Autorizados",
    value: 2,
    subtitle: "cobranças ativas",
    icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    label: "Pendentes",
    value: 1,
    subtitle: "aguardando confirmação",
    icon: Clock,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    label: "Cancelados",
    value: 1,
    subtitle: "encerrados pelo doador",
    icon: Ban,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    label: "Recusados",
    value: 1,
    subtitle: "negados pelo banco",
    icon: CircleX,
    iconBg: "bg-red-100",
    iconColor: "text-red-700",
  },
];

const MOCK_AUTHORIZATIONS = [
  {
    id: "1",
    name: "Ana Paula Ribeiro",
    phone: "+55 11 98765-4321",
    cpf: "123.456.789-01",
    status: "authorized",
    authorization: "02/07/2026 09:14",
    lastUpdated: "02/07/2026 09:15",
  },
  {
    id: "2",
    name: "Carlos Eduardo Souza",
    phone: "+55 21 99123-4567",
    cpf: "987.654.321-00",
    status: "pending",
    authorization: null,
    lastUpdated: "06/07/2026 18:02",
  },
  {
    id: "3",
    name: "Mariana Costa Lima",
    phone: "+55 31 98888-1122",
    cpf: "456.789.123-22",
    status: "canceled",
    authorization: "18/05/2026 14:20",
    lastUpdated: "28/06/2026 10:05",
  },
  {
    id: "4",
    name: "Roberto Nogueira",
    phone: "+55 41 97777-3344",
    cpf: "321.654.987-45",
    status: "rejected",
    authorization: null,
    lastUpdated: "24/06/2026 16:48",
  },
  {
    id: "5",
    name: "Juliana Martins",
    phone: "+55 51 96666-9090",
    cpf: "159.753.486-10",
    status: "authorized",
    authorization: "11/06/2026 08:31",
    lastUpdated: "01/07/2026 08:00",
  },
];

function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardItem) {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card px-7">
      <div className="flex items-center justify-between pb-3 pt-7">
        <span className="text-base tracking-tight text-muted-foreground">
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
      <div className="flex flex-col gap-0.5 pb-7">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function AutomaticPixPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Pix Automático
        </h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe as autorizações de Pix Automático dos doadores desta
          campanha.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <Card.Root className="gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="pb-1 text-base font-semibold text-foreground">
            Autorizações
          </h2>
          <div className="flex items-center gap-2.5">
            <div className="w-80">
              <Input
                leftIcon={Search}
                placeholder="Buscar por nome, CPF, e-mail..."
                className="h-11 rounded-xl border-transparent bg-background"
              />
            </div>
            <div className="w-48">
              <Select.Root defaultValue="all">
                <Select.Trigger className="h-11 rounded-xl">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">Todos os status</Select.Item>
                  <Select.Item value="authorized">Autorizado</Select.Item>
                  <Select.Item value="pending">Pendente</Select.Item>
                  <Select.Item value="canceled">Cancelado</Select.Item>
                  <Select.Item value="rejected">Recusado</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Nome</Table.Head>
              <Table.Head>CPF</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Autorização</Table.Head>
              <Table.Head>Última atualização</Table.Head>
              <Table.Head className="text-right">Ações</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {MOCK_AUTHORIZATIONS.map((item) => {
              const badge = STATUS_BADGE[item.status];
              return (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.phone}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {item.cpf}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={badge?.variant ?? "neutral"}>
                      {badge?.label ?? item.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {item.authorization ?? "—"}
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {item.lastUpdated}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-foreground"
                      >
                        <ExternalLink size={14} />
                        Autorização
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-foreground"
                      >
                        <History size={14} />
                        Histórico
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
            {!MOCK_AUTHORIZATIONS.length && <Table.Empty />}
          </Table.Body>
        </Table.Root>

        <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <TablePagination currentPage={1} totalPages={1} />
        </Card.Footer>
      </Card.Root>
    </div>
  );
}

export { AutomaticPixPage };
