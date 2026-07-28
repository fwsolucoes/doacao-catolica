import { Pencil, Trash2 } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/client/components/ui/tooltip";
import type { CampaignGroupModel, MetaModel } from "./types";

type CampaignGroupsTableProps = {
  campaignGroups: CampaignGroupModel[];
  meta: MetaModel;
  onEdit: (campaignGroup: CampaignGroupModel) => void;
  onDelete: (campaignGroup: CampaignGroupModel) => void;
};

function formatDate(value: string) {
  const brazilianDate = value.match(/^(\d{2}\/\d{2}\/\d{4})(?:\s|$)/);
  if (brazilianDate) return brazilianDate[1];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function CampaignGroupsTable({
  campaignGroups,
  meta,
  onEdit,
  onDelete,
}: CampaignGroupsTableProps) {
  return (
    <Card.Root className="gap-4 p-6">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nome</Table.Head>
            <Table.Head>Adicionado em</Table.Head>
            <Table.Head className="w-28 text-right">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {campaignGroups.map((campaignGroup) => (
            <Table.Row key={campaignGroup.id}>
              <Table.Cell className="font-medium">
                {campaignGroup.name}
              </Table.Cell>
              <Table.Cell className="text-muted-foreground">
                {formatDate(campaignGroup.createdAt)}
              </Table.Cell>
              <Table.Cell className="text-right">
                <TooltipProvider>
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-9 text-muted-foreground"
                          aria-label="Editar grupo de campanha"
                          onClick={() => onEdit(campaignGroup)}
                        >
                          <Pencil size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar grupo de campanha</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-9 text-destructive"
                          aria-label="Deletar grupo de campanha"
                          onClick={() => onDelete(campaignGroup)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Deletar grupo de campanha</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </Table.Cell>
            </Table.Row>
          ))}

          {!campaignGroups.length && <Table.Empty />}
        </Table.Body>
      </Table.Root>

      <Card.Footer className="flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span>Total de {meta.totalItems} registros</span>
        <span>
          Página {meta.currentPage} de {meta.totalPages}
        </span>
      </Card.Footer>
    </Card.Root>
  );
}

export { CampaignGroupsTable };
