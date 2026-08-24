import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <Card.Root className="gap-4 p-6">
      <Card.Header>
        <h2 className="text-base font-semibold text-foreground">
          Solicitações de saque
        </h2>
      </Card.Header>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Data solicitação</Table.Head>
            <Table.Head>Data transferência</Table.Head>
            <Table.Head>Valor</Table.Head>
            <Table.Head>Chave Pix</Table.Head>
            <Table.Head>Status</Table.Head>
            {/* <Table.Head className="text-right">Recibo</Table.Head> */}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transfers.data.map((transfer) => (
            <Table.Row key={transfer.id}>
              <Table.Cell className="text-sm text-muted-foreground">
                {formatDate(transfer.createdAt)}
              </Table.Cell>
              <Table.Cell className="text-sm text-muted-foreground">
                {formatDate(transfer.paidDate)}
              </Table.Cell>
              <Table.Cell className="font-semibold text-secondary-foreground">
                {formatCurrency(transfer.amount)}
              </Table.Cell>
              <Table.Cell className="text-muted-foreground">—</Table.Cell>
              <Table.Cell>
                <Badge
                  variant={getStatusVariant(transfer.status)}
                >
                  {formatStatus(transfer.status)}
                </Badge>
              </Table.Cell>
              {/* <Table.Cell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground"
                >
                  <ReceiptText size={16} />
                  Ver recibo
                </Button>
              </Table.Cell> */}
            </Table.Row>
          ))}

          {!transfers.data.length && <Table.Empty />}
        </Table.Body>
      </Table.Root>

      <Card.Footer className="flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:justify-between">
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
