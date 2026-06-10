import { ChevronsUpDown, Eye } from "lucide-react";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Pagination } from "~/client/components/ui/pagination";
import { Table } from "~/client/components/ui/table";

type BadgeVariant = "success" | "danger" | "warning" | "info";

type Campaign = {
  id: number;
  name: string;
  status: { variant: BadgeVariant; label: string };
  type: { variant: BadgeVariant; label: string };
  start: string;
  end: string;
};

const campaigns: Campaign[] = [
  {
    id: 1,
    name: "Nome da campanha",
    status: { variant: "success", label: "Ativo" },
    type: { variant: "info", label: "Doação mensal e avulsa" },
    start: "01/05/2024 - 08:00",
    end: "22/05/2024 - 23:59",
  },
  {
    id: 2,
    name: "Nome da campanha",
    status: { variant: "danger", label: "Desativado" },
    type: { variant: "warning", label: "Doação mensal" },
    start: "01/04/2024 - 08:00",
    end: "01/05/2024 - 23:59",
  },
  {
    id: 3,
    name: "Nome da campanha",
    status: { variant: "success", label: "Ativo" },
    type: { variant: "success", label: "Doação avulsa" },
    start: "01/05/2024 - 08:00",
    end: "22/05/2024 - 23:59",
  },
];

const TOTAL_PAGES = 12;
const CURRENT_PAGE = 1;
const VISIBLE_PAGES = [1, 2, 3, 4];

export default function TestPage() {
  return (
    <div className="p-8">
      <Card.Root>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Nome</Table.Head>
              <Table.Head className="w-[150px]">Status</Table.Head>
              <Table.Head className="w-[230px]">Tipo</Table.Head>
              <Table.Head className="w-[200px]">Início da campanha</Table.Head>
              <Table.Head className="w-[200px]">Término da campanha</Table.Head>
              <Table.Head className="w-[130px] text-center">Ações</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {campaigns.map((campaign) => (
              <Table.Row key={campaign.id}>
                <Table.Cell>{campaign.name}</Table.Cell>
                <Table.Cell>
                  <Badge variant={campaign.status.variant}>
                    {campaign.status.label}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={campaign.type.variant}>
                    {campaign.type.label}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{campaign.start}</Table.Cell>
                <Table.Cell>{campaign.end}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      className="h-8 min-h-0 w-auto rounded-md px-4 py-0 text-xs text-[rgb(var(--spotlight-primary))]"
                    >
                      Gerenciar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-md text-[rgb(var(--spotlight-primary))]"
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Card.Footer className="justify-between">
          <p className="flex-1 text-sm text-(--text-muted)">
            Exibindo {CURRENT_PAGE} de {TOTAL_PAGES} páginas
          </p>
          <Pagination.Root>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous href="#" />
              </Pagination.Item>
              {VISIBLE_PAGES.map((page) => (
                <Pagination.Item key={page}>
                  <Pagination.Link href="#" isActive={page === CURRENT_PAGE}>
                    {page}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Ellipsis />
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Link href="#">{TOTAL_PAGES}</Pagination.Link>
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Next href="#" />
              </Pagination.Item>
            </Pagination.Content>
          </Pagination.Root>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
