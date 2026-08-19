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
import { useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { PixAuthorizationHistoryDialog } from "./components/pixAuthorizationHistoryDialog";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import type { AutomaticPixLoader } from "~/client/types/automaticPixLoader";
import { cn } from "~/lib/utils";

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "neutral"
  | "emerald"
  | "amber";

// known values: "ACTIVE" | "CREATED" | "REFUSED" | "EXPIRED" | "CANCELLED"
const STATUS_BADGE: Record<string, BadgeVariant> = {
  ACTIVE: "emerald",
  CREATED: "amber",
  REFUSED: "danger",
  EXPIRED: "neutral",
  CANCELLED: "neutral",
};

type StatCardItem = {
  label: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

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
  const { summary, authorizations } = useLoaderData<AutomaticPixLoader>();
  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const sp = new URLSearchParams(location.search);
  const [searchValue, setSearchValue] = useState(() => sp.get("search") ?? "");
  const [historyTarget, setHistoryTarget] = useState<{
    customerName: string;
    subscriptionUuid: string;
  } | null>(null);
  const closeHistory = useCallback(() => setHistoryTarget(null), []);

  useEffect(() => {
    setSearchValue(new URLSearchParams(location.search).get("search") ?? "");
  }, [location.search]);

  function handleSearch(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(location.search);
      if (value) next.set("search", value);
      else next.delete("search");
      next.delete("page");
      navigate(`?${next.toString()}`);
    }, 400);
  }

  function handleStatusChange(value: string) {
    const next = new URLSearchParams(location.search);
    if (value) next.set("status", value);
    else next.delete("status");
    next.delete("page");
    navigate(`?${next.toString()}`);
  }

  const statCards: StatCardItem[] = [
    {
      label: "Autorizados",
      value: summary.active,
      subtitle: "cobranças ativas",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      label: "Pendentes",
      value: summary.awaitingAuthorization,
      subtitle: "aguardando confirmação",
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      label: "Cancelados",
      value: summary.cancelled,
      subtitle: "encerrados pelo doador",
      icon: Ban,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
    },
    {
      label: "Recusados",
      value: summary.refused,
      subtitle: "negados pelo banco",
      icon: CircleX,
      iconBg: "bg-red-100",
      iconColor: "text-red-700",
    },
  ];

  const { data, meta } = authorizations;

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
        {statCards.map((card) => (
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
                placeholder="Buscar por nome ou CPF..."
                className="h-11 rounded-xl border-transparent bg-background"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select.Root
                value={sp.get("status") ?? ""}
                onValueChange={handleStatusChange}
              >
                <Select.Trigger className="h-11 rounded-xl">
                  <Select.Value placeholder="Todos os status" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="">Todos os status</Select.Item>
                  <Select.Item value="ACTIVE">Ativa</Select.Item>
                  <Select.Item value="CREATED">
                    Aguardando autorização
                  </Select.Item>
                  <Select.Item value="REFUSED">Recusada</Select.Item>
                  <Select.Item value="EXPIRED">Expirada</Select.Item>
                  <Select.Item value="CANCELLED">Cancelada</Select.Item>
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
            {data.map((item) => {
              const badgeVariant = STATUS_BADGE[item.status] ?? "neutral";
              return (
                <Table.Row key={item.authorizationUuid}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">
                        {item.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.customerPhone ?? "—"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {item.customerCpfCnpj ?? "—"}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={badgeVariant}>{item.statusLabel}</Badge>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {item.authorizationCreatedAt ?? "—"}
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {item.statusUpdatedAt}
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
                        disabled={item.authorizationsCount <= 1}
                        onClick={() =>
                          setHistoryTarget({
                            customerName: item.customerName,
                            subscriptionUuid: item.subscriptionUuid,
                          })
                        }
                      >
                        <History size={14} />
                        Histórico
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
            {!data.length && <Table.Empty />}
          </Table.Body>
        </Table.Root>

        <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <TablePagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
          />
        </Card.Footer>
      </Card.Root>

      <PixAuthorizationHistoryDialog
        customerName={historyTarget?.customerName ?? null}
        subscriptionUuid={historyTarget?.subscriptionUuid ?? null}
        onClose={closeHistory}
      />
    </div>
  );
}

export { AutomaticPixPage };
