import {
  HandCoins,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import type { DonorsLoader } from "~/client/types/donorsLoader";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Empty } from "~/client/components/ui/empty";
import { Input } from "~/client/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/client/components/ui/popover";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { formatCurrency } from "~/lib/formatCurrency";
import { getInitials } from "~/lib/getInitials";
import { cn } from "~/lib/utils";

type Tab = "recorrentes" | "pontuais";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  automatic_pix: "Pix Automático",
  pix: "Pix",
  bank_slip: "Boleto",
  credit_card: "Cartão",
};

function formatApiDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return dateStr.split(" ")[0];
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
  count: number;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "h-auto gap-2 rounded-xl px-3.5 py-2 text-sm font-normal",
        active
          ? "bg-card text-foreground font-semibold shadow-sm hover:bg-card"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon size={16} className="shrink-0" />
      {label}
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs",
          active
            ? "bg-muted text-foreground"
            : "bg-muted/70 text-muted-foreground",
        )}
      >
        {count}
      </span>
    </Button>
  );
}

function ActionsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground"
        >
          <MoreHorizontal size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1.5" align="end" sideOffset={4}>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
        >
          Ver detalhes
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function DonorsTable() {
  const { donors, summary } = useLoaderData<DonorsLoader>();
  const [activeTab, setActiveTab] = useState<Tab>("recorrentes");
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchValue =
    new URLSearchParams(location.search).get("donor_search") ?? "";

  function handleSearch(value: string) {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (value) params.set("donor_search", value);
      else params.delete("donor_search");
      params.delete("page");
      navigate(`${location.pathname}?${params.toString()}`);
    }, 500);
  }

  const visibleDonors = activeTab === "recorrentes" ? donors.data : [];

  return (
    <Card.Root className="gap-0 overflow-hidden p-0">
      {/* Tab bar */}
      <div className="mx-6 mt-6 flex w-fit items-center gap-1 rounded-xl border border-border bg-muted/60 p-1.5">
        <TabButton
          active={activeTab === "recorrentes"}
          onClick={() => setActiveTab("recorrentes")}
          icon={RefreshCw}
          label="Doadores recorrentes"
          count={summary.recurringDonors}
        />
        <TabButton
          active={activeTab === "pontuais"}
          onClick={() => setActiveTab("pontuais")}
          icon={HandCoins}
          label="Doadores pontuais"
          count={summary.oneTimeDonors}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-6 pb-4 pt-6">
        <div className="flex-1">
          <Input
            leftIcon={Search}
            placeholder="Buscar por nome, CPF, e-mail ou telefone..."
            className="h-11 rounded-xl border-transparent bg-muted/50"
            defaultValue={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="h-11 min-h-0 shrink-0 gap-2 px-4 text-sm"
        >
          <SlidersHorizontal size={16} />
          Filtros
        </Button>
      </div>

      {/* Table */}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Doador</Table.Head>
            <Table.Head>Contato</Table.Head>
            <Table.Head>Doações 12m</Table.Head>
            <Table.Head>Última doação</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-center">Notif.</Table.Head>
            <Table.Head>Recorrência</Table.Head>
            <Table.Head>Pagamento</Table.Head>
            <Table.Head>Cadastro</Table.Head>
            <Table.Head className="text-right">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {visibleDonors.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={10}>
                <Empty.Root className="py-12">
                  <Empty.Media variant="icon">
                    <Users />
                  </Empty.Media>
                  <Empty.Header>
                    <Empty.Title>Nenhum doador encontrado</Empty.Title>
                    <Empty.Description>
                      {activeTab === "recorrentes" && searchValue
                        ? "Tente ajustar os termos da busca."
                        : "Ainda não há doadores nesta categoria."}
                    </Empty.Description>
                  </Empty.Header>
                </Empty.Root>
              </Table.Cell>
            </Table.Row>
          ) : (
            visibleDonors.map((donor) => (
              <Table.Row key={donor.subscriptionUuid}>
                <Table.Cell>
                  <div className="flex items-center gap-3.5">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                        {getInitials(donor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">
                        {donor.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {donor.cpf ?? "—"}
                      </span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">
                      {donor.email ?? "—"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {donor.phone ?? "—"}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-sm text-foreground">
                  {donor.donationsLast12Months}
                </Table.Cell>
                <Table.Cell className="text-sm text-muted-foreground">
                  {formatApiDate(donor.lastDonationAt)}
                </Table.Cell>
                <Table.Cell>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      donor.status
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {donor.status ? "Ativo" : "Inativo"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-2">
                    <Mail
                      size={16}
                      className={
                        donor.email
                          ? "text-muted-foreground"
                          : "text-muted-foreground/30"
                      }
                    />
                    <WhatsAppIcon
                      size={16}
                      className={
                        donor.activeNotification
                          ? "text-[rgb(var(--spotlight-success))]"
                          : "text-muted-foreground/30"
                      }
                    />
                  </div>
                </Table.Cell>
                <Table.Cell className="text-sm text-foreground">
                  {formatCurrency(String(donor.amount))}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">
                      Dia {donor.payDay}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {PAYMENT_METHOD_LABEL[donor.paymentMethod] ?? donor.paymentMethod}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-sm text-muted-foreground">
                  {formatApiDate(donor.registeredAt)}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <ActionsPopover />
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {activeTab === "recorrentes" && (
        <Card.Footer className="flex-col items-center gap-3 px-6 pb-6 pt-4 sm:flex-row sm:justify-between">
          <TablePagination
            currentPage={donors.meta.page}
            totalPages={donors.meta.totalPages}
          />
        </Card.Footer>
      )}
    </Card.Root>
  );
}

export { DonorsTable };
