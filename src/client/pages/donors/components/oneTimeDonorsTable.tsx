// src/client/pages/donors/components/oneTimeDonorsTable.tsx
import {
  ArrowRightLeft,
  MoreHorizontal,
  Pencil,
  ReceiptText,
  RefreshCw,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { DonorsLoader } from "~/client/types/donorsLoader";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
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
import { useRoot } from "~/client/hooks/useRoot";

type OneTimeDonorRow = NonNullable<
  DonorsLoader["oneTimeDonors"]
>["data"][number];

function formatApiDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return dateStr.split(" ")[0];
}

function OneTimeDonorRow({
  donor,
  currentUrl,
}: {
  donor: OneTimeDonorRow;
  currentUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const { environmentVariables, user } = useRoot();
  const whatsAppHref = buildWhatsAppHref(donor.phone);
  const editDonorHref = `${environmentVariables.SANCTON_CRM_PANEL_URL}/api/auth/token?token=${user?.token ?? ""}&redirect=/contact/${donor.customerUuid}?redirectBack=${encodeURIComponent(currentUrl)}`;

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
              <a href={editDonorHref}>
                <Pencil size={16} />
                Editar doador
              </a>
            </Button>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
            >
              <ArrowRightLeft size={16} />
              Converter em recorrente
            </Button>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
            >
              <ReceiptText size={16} />
              Criar pagamento avulso
            </Button>
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
          </PopoverContent>
        </Popover>
      </Table.Cell>
    </Table.Row>
  );
}

type OneTimeDonorsTableProps = {
  oneTimeDonors: NonNullable<DonorsLoader["oneTimeDonors"]>;
  currentUrl: string;
  searchValue: string;
};

function OneTimeDonorsTable({
  oneTimeDonors,
  currentUrl,
  searchValue,
}: OneTimeDonorsTableProps) {
  return (
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
          {oneTimeDonors.data.length === 0 ? (
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
            oneTimeDonors.data.map((donor) => (
              <OneTimeDonorRow
                key={donor.transferUuid}
                donor={donor}
                currentUrl={currentUrl}
              />
            ))
          )}
        </Table.Body>
      </Table.Root>
      <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <TablePagination
          currentPage={oneTimeDonors.meta.page}
          totalPages={oneTimeDonors.meta.totalPages}
        />
      </Card.Footer>
    </>
  );
}

export { OneTimeDonorsTable };
