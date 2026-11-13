import { MoreHorizontal, Pencil, Ticket, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Table } from "~/client/components/ui/table";
import type { RaffleItem } from "../types";

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  active: {
    className: "bg-(--badge-emerald-bg) text-(--badge-emerald-text)",
    label: "Ativo",
  },
  inactive: { className: "bg-muted text-muted-foreground", label: "Inativo" },
};

type RafflesTableProps = {
  raffles: RaffleItem[];
  onEdit: (raffle: RaffleItem) => void;
  onDelete: (raffle: RaffleItem) => void;
};

function RafflesTable({ raffles, onEdit, onDelete }: RafflesTableProps) {
  const navigate = useNavigate();

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Sorteio</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Período</Table.Head>
          <Table.Head>Valor do bilhete</Table.Head>
          <Table.Head>Numeração</Table.Head>
          <Table.Head className="text-right">Ações</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {raffles.map((raffle) => {
          const badge = STATUS_BADGE[raffle.status];

          return (
            <Table.Row key={raffle.id}>
              <Table.Cell className="max-w-120 whitespace-normal">
                <span className="font-semibold">{raffle.name}</span>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  className={badge?.className ?? "bg-muted text-muted-foreground"}
                >
                  {badge?.label ?? raffle.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-col">
                  <span>{raffle.startDate}</span>
                  <span className="text-xs text-muted-foreground">
                    até {raffle.endDate}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>{raffle.ticketPriceLabel}</Table.Cell>
              <Table.Cell>
                <div className="flex flex-col">
                  <span>{raffle.numberRangeLabel}</span>
                  <span className="text-xs text-muted-foreground">
                    {raffle.totalNumbersLabel}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9"
                      aria-label={`Ações do sorteio ${raffle.name}`}
                    >
                      <MoreHorizontal size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onSelect={() => navigate(`${raffle.id}/tickets`)}
                    >
                      <Ticket size={16} />
                      Ver bilhetes
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEdit(raffle)}>
                      <Pencil size={16} />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => onDelete(raffle)}
                    >
                      <Trash2 size={16} />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          );
        })}
        {!raffles.length && (
          <Table.Empty
            icon={<Ticket />}
            title="Nenhum sorteio encontrado."
            description="Cadastre um sorteio para que as doações desta campanha gerem bilhetes."
          />
        )}
      </Table.Body>
    </Table.Root>
  );
}

export { RafflesTable };
