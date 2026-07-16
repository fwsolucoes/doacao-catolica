import { ChevronLeft, ChevronRight, ReceiptText } from "lucide-react";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import type { TransfersLoader } from "~/client/types/transfersLoader";
import {
  formatCurrency,
  formatDate,
  formatStatus,
  getStatusVariant,
} from "./utils";

type TransfersTableProps = {
  transfers: TransfersLoader["transfers"];
};

function TransfersTable({ transfers }: TransfersTableProps) {
  return (
    <Card.Root className="gap-5 rounded-2xl p-6">
      <Card.Header>
        <h2 className="text-base font-semibold text-foreground">
          Solicitações de saque
        </h2>
      </Card.Header>

      <Table.Root>
        <Table.Header className="bg-transparent">
          <Table.Row>
            <Table.Head>Data solicitação</Table.Head>
            <Table.Head>Data transferência</Table.Head>
            <Table.Head>Valor</Table.Head>
            <Table.Head>Chave Pix</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-right">Recibo</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body className="before:hidden [&>tr]:h-14 [&>tr:nth-child(odd)]:bg-transparent [&>tr]:border-b [&>tr]:border-border">
          {transfers.data.map((transfer) => (
            <Table.Row key={transfer.id}>
              <Table.Cell>{formatDate(transfer.createdAt)}</Table.Cell>
              <Table.Cell className="text-muted-foreground">
                {formatDate(transfer.paidDate)}
              </Table.Cell>
              <Table.Cell className="font-semibold">
                {formatCurrency(transfer.amount)}
              </Table.Cell>
              <Table.Cell className="text-muted-foreground">—</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(transfer.status)}>
                  {formatStatus(transfer.status)}
                </Badge>
              </Table.Cell>
              <Table.Cell className="text-right">
                <Button variant="outline" size="sm" className="gap-2">
                  <ReceiptText size={14} />
                  Ver recibo
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}

          {!transfers.data.length && (
            <Table.Row>
              <Table.Cell
                colSpan={6}
                className="h-28 text-center text-muted-foreground"
              >
                Nenhuma solicitação de saque encontrada.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      <Card.Footer className="justify-between text-sm text-muted-foreground">
        <span>Total de {transfers.meta.totalItems} registros</span>
        <div className="flex items-center gap-3">
          <span>
            Página {transfers.meta.page} de {transfers.meta.totalPages}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="size-9" disabled>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="icon" className="size-9" disabled>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card.Footer>
    </Card.Root>
  );
}

export { TransfersTable };
