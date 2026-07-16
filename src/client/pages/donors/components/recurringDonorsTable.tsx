import {
  Ban,
  BellOff,
  BellRing,
  CalendarSync,
  Eye,
  MoreHorizontal,
  Pencil,
  Receipt,
  ReceiptText,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import type { DonorsLoader } from "~/client/types/donorsLoader";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Empty } from "~/client/components/ui/empty";
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
import { buildWhatsAppHref } from "~/lib/buildWhatsAppHref";
import { cn } from "~/lib/utils";
import type { DialogState, DonorRow } from "./donorsTable";

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
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

type RecurringDonorRowProps = {
  donor: DonorRow;
  setDialog: (state: DialogState) => void;
};

function RecurringDonorRow({ donor, setDialog }: RecurringDonorRowProps) {
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
            <BellRing size={16} className="text-sidebar-accent-foreground" />
          ) : (
            <BellOff size={16} className="text-muted-foreground" />
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
                badge?.className ?? "bg-muted text-muted-foreground",
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
  );
}

type RecurringDonorsTableProps = {
  donors: DonorsLoader["donors"];
  searchValue: string;
  setDialog: (state: DialogState) => void;
};

function RecurringDonorsTable({
  donors,
  searchValue,
  setDialog,
}: RecurringDonorsTableProps) {
  return (
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
          {donors.data.length === 0 ? (
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
            donors.data.map((donor) => (
              <RecurringDonorRow
                key={donor.subscriptionUuid}
                donor={donor}
                setDialog={setDialog}
              />
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
  );
}

export { RecurringDonorsTable };
