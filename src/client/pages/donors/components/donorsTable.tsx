import {
  Ban,
  BellOff,
  BellRing,
  CalendarSync,
  Eye,
  HandCoins,
  MoreHorizontal,
  Pencil,
  Receipt,
  ReceiptText,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import type { DonorsLoader } from "~/client/types/donorsLoader";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
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
import { DisableRecurrenceDialog } from "./disableRecurrenceDialog";
import { DonorsFilterDrawer } from "./donorsFilterDrawer";
import { EnableRecurrenceDialog } from "./enableRecurrenceDialog";
import { GenerateBookletDialog } from "./generateBookletDialog";
import { GenerateUpcomingPaymentsDialog } from "./generateUpcomingPaymentsDialog";
import { UpdateRecurrenceDialog } from "./updateRecurrenceDialog";

type Tab = "recorrentes" | "pontuais";
type DonorRow = DonorsLoader["donors"]["data"][number];
type OneTimeDonorRow = NonNullable<DonorsLoader["oneTimeDonors"]>["data"][number];

type DialogState =
  | { type: "updateRecurrence"; donor: DonorRow }
  | { type: "generateUpcoming"; subscriptionUuid: string }
  | { type: "generateBooklet"; subscriptionUuid: string }
  | { type: "disableRecurrence"; subscriptionUuid: string; name: string }
  | { type: "enableRecurrence"; subscriptionUuid: string; name: string }
  | null;

const PAYMENT_METHOD_BADGE: Record<
  string,
  { className: string; label: string }
> = {
  automatic_pix: {
    className: "bg-violet-100 text-purple-800",
    label: "Pix Automático",
  },
  pix: { className: "bg-emerald-100 text-emerald-700", label: "Pix" },
  bank_slip: { className: "bg-orange-100 text-orange-700", label: "Boleto" },
  credit_card: {
    className: "bg-blue-100 text-blue-800",
    label: "Cartão de Crédito",
  },
};

function formatApiDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return dateStr.split(" ")[0];
}

function buildWhatsAppHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const number = digits.startsWith("55") ? digits : `55${digits}`;
  // número mínimo: 55 + DDD (2) + 8 dígitos = 12; máximo: 55 + DDD (2) + 9 dígitos = 13
  if (number.length < 12 || number.length > 13) return null;
  return `https://wa.me/${number}`;
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

type ActionsPopoverProps = {
  donor: DonorRow;
  onEditRecurrence: () => void;
  onGenerateUpcoming: () => void;
  onGenerateBooklet: () => void;
  onCancelRecurrence: () => void;
  onEnableRecurrence: () => void;
};

function ActionsPopover({
  donor,
  onEditRecurrence,
  onGenerateUpcoming,
  onGenerateBooklet,
  onCancelRecurrence,
  onEnableRecurrence,
}: ActionsPopoverProps) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [open, setOpen] = useState(false);

  const donationsHref = `/campaign/${campaignId}/donations?customer_reference=${donor.customerReference}`;
  const whatsAppHref = buildWhatsAppHref(donor.phone);

  function openDialog(fn: () => void) {
    setOpen(false);
    fn();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground"
        >
          <MoreHorizontal size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1.5" align="end" sideOffset={4}>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
          asChild
        >
          <Link to={donationsHref}>
            <Eye size={16} />
            Ver doações
          </Link>
        </Button>
        {donor.status ? (
          <>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
              onClick={() => openDialog(onEditRecurrence)}
            >
              <Pencil size={16} />
              Editar recorrência
            </Button>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
              onClick={() => openDialog(onGenerateUpcoming)}
            >
              <Receipt size={16} />
              Gerar próximas cobranças
            </Button>
            {donor.paymentMethod === "bank_slip" && (
              <Button
                variant="ghost"
                className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
                onClick={() => openDialog(onGenerateBooklet)}
              >
                <ReceiptText size={16} />
                Gerar carnê
              </Button>
            )}
            {whatsAppHref && (
              <Button
                variant="ghost"
                className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
                asChild
              >
                <a href={whatsAppHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={16} />
                  Falar no WhatsApp
                </a>
              </Button>
            )}
            <div className="my-1 h-px bg-muted" />
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-destructive hover:bg-muted"
              onClick={() => openDialog(onCancelRecurrence)}
            >
              <Ban size={16} />
              Cancelar recorrência
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
            onClick={() => openDialog(onEnableRecurrence)}
          >
            <CalendarSync size={16} />
            Ativar recorrência
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

function OneTimeDonorRow({ donor }: { donor: OneTimeDonorRow }) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [open, setOpen] = useState(false);
  const donationsHref = `/campaign/${campaignId}/donations?customer_reference=${donor.customerReference}`;
  const whatsAppHref = buildWhatsAppHref(donor.phone);

  return (
    <Table.Row>
      <Table.Cell>
        <div className="flex items-center gap-3.5">
          <Avatar size="lg">
            <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
              {getInitials(donor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm text-foreground">{donor.name}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {donor.cpf ?? "—"}
            </span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex flex-col">
          <span className="text-sm text-foreground">{donor.email ?? "—"}</span>
          <span className="text-xs text-muted-foreground">
            {donor.phone ?? "—"}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell className="text-sm text-muted-foreground">
        {formatApiDate(donor.registeredAt)}
      </Table.Cell>
      <Table.Cell>
        {donor.isRecurring ? (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sidebar-accent-foreground/15 px-3 py-1 text-xs font-semibold text-sidebar-accent-foreground">
              <RefreshCw size={10} />
              Recorrente
            </span>
            <span className="text-xs text-muted-foreground">
              desde {formatApiDate(donor.recurringSince)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </Table.Cell>
      <Table.Cell>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(String(donor.amount))}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatApiDate(donor.lastDonationAt)}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell className="text-right">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 text-muted-foreground"
            >
              <MoreHorizontal size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-1.5" align="end" sideOffset={4}>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
              asChild
            >
              <Link to={donationsHref}>
                <Eye size={16} />
                Ver doações
              </Link>
            </Button>
            {whatsAppHref && (
              <Button
                variant="ghost"
                className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
                asChild
              >
                <a href={whatsAppHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={16} />
                  Falar no WhatsApp
                </a>
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </Table.Cell>
    </Table.Row>
  );
}

function DonorsTable() {
  const { donors, summary, oneTimeDonors } = useLoaderData<DonorsLoader>();
  const [dialog, setDialog] = useState<DialogState>(null);
  const closeDialog = useCallback(() => setDialog(null), []);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const activeTab = (searchParams.get("tab") ?? "recorrentes") as Tab;
  const searchValue = searchParams.get("donor_search") ?? "";

  function handleTabChange(tab: Tab) {
    const params = new URLSearchParams(location.search);
    if (tab === "recorrentes") params.delete("tab");
    else params.set("tab", tab);
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  }

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

  const visibleDonors = donors.data;
  const visibleOneTimeDonors = oneTimeDonors?.data ?? [];

  return (
    <>
      <Card.Root className="gap-4 p-6">
        {/* Tab bar */}
        <div className="flex w-fit items-center gap-1 rounded-xl border border-border bg-muted/60 p-1.5">
          <TabButton
            active={activeTab === "recorrentes"}
            onClick={() => handleTabChange("recorrentes")}
            icon={RefreshCw}
            label="Doadores recorrentes"
            count={summary.recurringDonors}
          />
          <TabButton
            active={activeTab === "pontuais"}
            onClick={() => handleTabChange("pontuais")}
            icon={HandCoins}
            label="Doadores pontuais"
            count={summary.oneTimeDonors}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1">
            <Input
              leftIcon={Search}
              placeholder="Buscar por nome, CPF, e-mail ou telefone..."
              className="h-11 rounded-xl border-transparent bg-muted/50"
              defaultValue={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <DonorsFilterDrawer />
        </div>

        {/* Table */}
        {activeTab === "recorrentes" ? (
          <>
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
                            {searchValue
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
                        <Badge variant={donor.status ? "success" : "danger"}>
                          {donor.status ? "Ativo" : "Inativo"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center justify-center">
                          {donor.activeNotification ? (
                            <BellRing
                              size={16}
                              className="text-sidebar-accent-foreground"
                            />
                          ) : (
                            <BellOff
                              size={16}
                              className="text-muted-foreground"
                            />
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">
                            {formatCurrency(String(donor.amount))}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            todo dia {donor.payDay}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {(() => {
                          const badge = PAYMENT_METHOD_BADGE[donor.paymentMethod];
                          return (
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-xs",
                                badge?.className ??
                                  "bg-muted text-muted-foreground",
                              )}
                            >
                              {badge?.label ?? donor.paymentMethod}
                            </span>
                          );
                        })()}
                      </Table.Cell>
                      <Table.Cell className="text-sm text-muted-foreground">
                        {formatApiDate(donor.registeredAt)}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <ActionsPopover
                          donor={donor}
                          onEditRecurrence={() =>
                            setDialog({ type: "updateRecurrence", donor })
                          }
                          onGenerateUpcoming={() =>
                            setDialog({
                              type: "generateUpcoming",
                              subscriptionUuid: donor.subscriptionUuid,
                            })
                          }
                          onGenerateBooklet={() =>
                            setDialog({
                              type: "generateBooklet",
                              subscriptionUuid: donor.subscriptionUuid,
                            })
                          }
                          onCancelRecurrence={() =>
                            setDialog({
                              type: "disableRecurrence",
                              subscriptionUuid: donor.subscriptionUuid,
                              name: donor.name,
                            })
                          }
                          onEnableRecurrence={() =>
                            setDialog({
                              type: "enableRecurrence",
                              subscriptionUuid: donor.subscriptionUuid,
                              name: donor.name,
                            })
                          }
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>

            <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <TablePagination
                currentPage={donors.meta.page}
                totalPages={donors.meta.totalPages}
              />
            </Card.Footer>
          </>
        ) : (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Doador</Table.Head>
                  <Table.Head>Contato</Table.Head>
                  <Table.Head>Cadastro</Table.Head>
                  <Table.Head>Recorrente</Table.Head>
                  <Table.Head>Última doação</Table.Head>
                  <Table.Head className="text-right">Ações</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {visibleOneTimeDonors.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6}>
                      <Empty.Root className="py-12">
                        <Empty.Media variant="icon">
                          <Users />
                        </Empty.Media>
                        <Empty.Header>
                          <Empty.Title>Nenhum doador encontrado</Empty.Title>
                          <Empty.Description>
                            {searchValue
                              ? "Tente ajustar os termos da busca."
                              : "Ainda não há doadores nesta categoria."}
                          </Empty.Description>
                        </Empty.Header>
                      </Empty.Root>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  visibleOneTimeDonors.map((donor) => (
                    <OneTimeDonorRow key={donor.transferUuid} donor={donor} />
                  ))
                )}
              </Table.Body>
            </Table.Root>

            {oneTimeDonors && (
              <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <TablePagination
                  currentPage={oneTimeDonors.meta.page}
                  totalPages={oneTimeDonors.meta.totalPages}
                />
              </Card.Footer>
            )}
          </>
        )}
      </Card.Root>

      <UpdateRecurrenceDialog
        donor={dialog?.type === "updateRecurrence" ? dialog.donor : null}
        onClose={closeDialog}
      />
      <GenerateUpcomingPaymentsDialog
        subscriptionUuid={
          dialog?.type === "generateUpcoming" ? dialog.subscriptionUuid : null
        }
        onClose={closeDialog}
      />
      <DisableRecurrenceDialog
        subscriptionUuid={
          dialog?.type === "disableRecurrence" ? dialog.subscriptionUuid : null
        }
        name={dialog?.type === "disableRecurrence" ? dialog.name : ""}
        onClose={closeDialog}
      />
      <EnableRecurrenceDialog
        subscriptionUuid={
          dialog?.type === "enableRecurrence" ? dialog.subscriptionUuid : null
        }
        name={dialog?.type === "enableRecurrence" ? dialog.name : ""}
        onClose={closeDialog}
      />
      <GenerateBookletDialog
        subscriptionUuid={
          dialog?.type === "generateBooklet" ? dialog.subscriptionUuid : null
        }
        onClose={closeDialog}
      />
    </>
  );
}

export { DonorsTable };
