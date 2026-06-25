import { Eye, FileDown, FileSymlink, Mail, Plus } from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/client/components/ui/tooltip";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import type { PaymentStatementsLoader } from "~/client/types/paymentStatementsLoader";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

const STATUS_BADGE: Record<string, BadgeVariant> = {
  "Disponível para saque": "success",
  "Pagamento confirmado": "success",
  Recebido: "success",
  "Aguardando pagamento": "warning",
  Estornado: "warning",
  Cancelado: "danger",
  Vencido: "danger",
  "Falha no pagamento": "danger",
  Excluído: "danger",
  Processando: "info",
};

const ORIGIN_BADGE: Record<string, BadgeVariant> = {
  Recorrente: "success",
  Pontual: "warning",
};

const PAYMENT_TYPE_BADGE: Record<string, BadgeVariant> = {
  Pix: "info",
  "Pix automático": "info",
  Boleto: "info",
  "Cartão de crédito": "info",
};

function ActionButton({
  tooltip,
  children,
}: {
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-secondary"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function PaymentsTable() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { payments } = useLoaderData<PaymentStatementsLoader>();

  const { data, meta } = payments;

  return (
    <Card.Root className="gap-4 p-6">
      <div className="flex justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 min-h-0 w-auto gap-1.5 rounded-md px-4 text-sm"
            >
              <Plus size={14} />
              Adicionar pagamento
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/campaign/${campaignId}/create-recurrence`}>
                Criar recorrência
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Criar pagamento avulso</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          className="h-9 min-h-0 w-auto gap-1.5 rounded-md px-4 text-sm"
        >
          <FileDown size={14} />
          Exportar relatório
        </Button>
      </div>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nome</Table.Head>
            <Table.Head>Tipo</Table.Head>
            <Table.Head>Valor</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-center">Notificado por</Table.Head>
            <Table.Head>Forma de pagamento</Table.Head>
            <Table.Head>Vencimento</Table.Head>
            <Table.Head>Pago em</Table.Head>
            <Table.Head className="text-center">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((payment) => (
            <Table.Row key={payment.id}>
              <Table.Cell>{payment.customerName}</Table.Cell>
              <Table.Cell>
                <Badge variant={ORIGIN_BADGE[payment.origin] ?? "info"}>
                  {payment.origin}
                </Badge>
              </Table.Cell>
              <Table.Cell>{payment.amount}</Table.Cell>
              <Table.Cell>
                <Badge variant={STATUS_BADGE[payment.status] ?? "info"}>
                  {payment.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-center gap-1.5">
                  {payment.notifiedByEmail && (
                    <Mail size={15} className="text-(--text-muted)" />
                  )}
                  {payment.notifiedByWhatsApp && (
                    <WhatsAppIcon
                      size={15}
                      className="text-[rgb(var(--spotlight-success))]"
                    />
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  variant={PAYMENT_TYPE_BADGE[payment.paymentType] ?? "info"}
                >
                  {payment.paymentType}
                </Badge>
              </Table.Cell>
              <Table.Cell>{payment.dueDate}</Table.Cell>
              <Table.Cell>{payment.paidDate ?? "—"}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-center gap-0.5">
                  <ActionButton tooltip="Visualizar detalhes">
                    <Eye
                      size={16}
                      className="text-[rgb(var(--spotlight-info))]"
                    />
                  </ActionButton>
                  <ActionButton tooltip="Link da fatura">
                    <FileSymlink
                      size={16}
                      className="text-[rgb(var(--spotlight-warning))]"
                    />
                  </ActionButton>
                  <ActionButton tooltip="Enviar lembrete">
                    <WhatsAppIcon
                      size={16}
                      className="text-[rgb(var(--spotlight-success))]"
                    />
                  </ActionButton>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <TablePagination currentPage={meta.page} totalPages={meta.totalPages} />
      </Card.Footer>
    </Card.Root>
  );
}

export { PaymentsTable };
