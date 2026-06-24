import { Eye, FolderOpen } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Empty } from "~/client/components/ui/empty";
import { Pagination } from "~/client/components/ui/pagination";
import { Table } from "~/client/components/ui/table";
import type { CampaignsLoader } from "~/client/types/campaignsLoader";

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

function typeVariantBadge(value: number): {
  variant: BadgeVariant;
  label: string;
} {
  switch (value) {
    case 1:
      return { variant: "info", label: "Doação" };
    case 2:
      return { variant: "warning", label: "Dizimo" };
    case 3:
      return { variant: "success", label: "Mensalidade" };
    default:
      return { variant: "danger", label: "Outro" };
  }
}

function TableCard() {
  const { campaigns } = useLoaderData<CampaignsLoader>();

  if (campaigns.data.length === 0) {
    return (
      <Card.Root>
        <Empty.Root className="border-none">
          <Empty.Header>
            <Empty.Media variant="icon">
              <FolderOpen />
            </Empty.Media>
            <Empty.Title>Nenhuma campanha cadastrada</Empty.Title>
          </Empty.Header>
          <Empty.Content>
            <Button asChild>
              <Link to="#">Criar campanha</Link>
            </Button>
          </Empty.Content>
        </Empty.Root>
      </Card.Root>
    );
  }

  return (
    <Card.Root>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nome</Table.Head>
            <Table.Head className="w-37.5">Status</Table.Head>
            <Table.Head className="w-57.5">Tipo</Table.Head>
            <Table.Head className="w-50">Início da campanha</Table.Head>
            <Table.Head className="w-50">Término da campanha</Table.Head>
            <Table.Head className="w-32.5 text-center">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {campaigns.data.map((campaign) => (
            <Table.Row key={campaign.id}>
              <Table.Cell>{campaign.name}</Table.Cell>
              <Table.Cell>
                <Badge variant={campaign.status ? "success" : "danger"}>
                  {campaign.status ? "Ativo" : "Inativo"}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={typeVariantBadge(campaign.type)?.variant}>
                  {typeVariantBadge(campaign.type)?.label}
                </Badge>
              </Table.Cell>
              <Table.Cell>{campaign.startDate}</Table.Cell>
              <Table.Cell>{campaign.endDate}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    className="h-8 min-h-0 w-auto rounded-md px-4 py-0 text-xs text-[rgb(var(--spotlight-primary))]"
                    asChild
                  >
                    <Link to={`/campaign/${campaign.id}/home`}>Gerenciar</Link>
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
  );
}

export { TableCard };
