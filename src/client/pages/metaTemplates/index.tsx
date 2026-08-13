import { useState } from "react";
import {
  Braces,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  LayoutTemplate,
  Megaphone,
  Plus,
  Search,
} from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { InputGroup } from "~/client/components/ui/input-group";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";
import type { MetaTemplatesLoader } from "~/client/types/metaTemplatesLoader";

const CATEGORY_BADGE: Record<string, { className: string; label: string }> = {
  utility: { className: "bg-emerald-100 text-emerald-700", label: "Utility" },
  marketing: { className: "bg-amber-100 text-amber-700", label: "Marketing" },
};

const HEADER_LABEL: Record<string, string> = {
  text: "Texto",
  image: "Imagem",
  video: "Vídeo",
  document: "Documento",
  location: "Localização",
};

function MetaTemplatesPage() {
  const { templates } = useLoaderData<MetaTemplatesLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = templates.filter((t) => {
    const notificationLabel = NOTIFICATION_TYPES[t.notificationType] ?? t.notificationType;
    const matchesSearch =
      !search ||
      t.templateName.toLowerCase().includes(search.toLowerCase()) ||
      notificationLabel.toLowerCase().includes(search.toLowerCase()) ||
      t.notificationType.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || t.templateType === category;
    return matchesSearch && matchesCategory;
  });

  const utilityCount = templates.filter((t) => t.templateType === "utility").length;
  const marketingCount = templates.filter((t) => t.templateType === "marketing").length;
  const variablesTotal = templates.reduce((sum, t) => sum + t.variablesCount, 0);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Templates META
          </h1>
          <p className="text-base text-muted-foreground">
            Cadastre os templates de WhatsApp aprovados na Meta e vincule as
            variáveis do sistema.
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link to={`/campaign/${campaignId}/meta-templates/new`}>
            <Plus size={16} />
            Novo template
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card.Root className="gap-4 p-6">
          <Card.MetricHeader label="Templates" icon={LayoutTemplate} color="info" />
          <div className="flex flex-col gap-1">
            <Card.MetricValue>{templates.length}</Card.MetricValue>
            <span className="text-xs text-muted-foreground">Cadastrados na conta</span>
          </div>
        </Card.Root>

        <Card.Root className="gap-4 p-6">
          <Card.MetricHeader label="Utility" icon={LayoutTemplate} color="success" />
          <div className="flex flex-col gap-1">
            <Card.MetricValue>{utilityCount}</Card.MetricValue>
            <span className="text-xs text-muted-foreground">Mensagens transacionais</span>
          </div>
        </Card.Root>

        <Card.Root className="gap-4 p-6">
          <Card.MetricHeader label="Marketing" icon={Megaphone} color="warning" />
          <div className="flex flex-col gap-1">
            <Card.MetricValue>{marketingCount}</Card.MetricValue>
            <span className="text-xs text-muted-foreground">Mensagens promocionais</span>
          </div>
        </Card.Root>

        <Card.Root className="gap-4 p-6">
          <Card.MetricHeader label="Variáveis" icon={Braces} color="accent" />
          <div className="flex flex-col gap-1">
            <Card.MetricValue>{variablesTotal}</Card.MetricValue>
            <span className="text-xs text-muted-foreground">Placeholders mapeados</span>
          </div>
        </Card.Root>
      </div>

      <Card.Root className="gap-0 p-0">
        <div className="flex items-center justify-between gap-4 p-7">
          <InputGroup.Root className="max-w-xl flex-1">
            <InputGroup.Addon>
              <Search size={16} />
            </InputGroup.Addon>
            <InputGroup.Input
              placeholder="Buscar por nome do template ou tipo de notificação…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </InputGroup.Root>

          <Select.Root value={category} onValueChange={setCategory}>
            <Select.Trigger className="w-52">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">Todas as categorias</Select.Item>
              <Select.Item value="utility">Utility</Select.Item>
              <Select.Item value="marketing">Marketing</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <div className="px-7 pb-7">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-72">Template</Table.Head>
                <Table.Head className="w-44">Categoria</Table.Head>
                <Table.Head className="w-80">Notificação</Table.Head>
                <Table.Head className="w-52">Cabeçalho</Table.Head>
                <Table.Head>Variáveis</Table.Head>
                <Table.Head>Botões</Table.Head>
                <Table.Head className="text-right">Ações</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.length === 0 ? (
                <Table.Empty description="Tente ajustar os filtros." />
              ) : (
                filtered.map((template) => {
                  const badge = CATEGORY_BADGE[template.templateType];
                  const headerLabel = template.headerType
                    ? (HEADER_LABEL[template.headerType] ?? template.headerType)
                    : "Sem cabeçalho";
                  const notificationLabel =
                    NOTIFICATION_TYPES[template.notificationType] ?? template.notificationType;
                  return (
                    <Table.Row key={template.uuid}>
                      <Table.Cell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">
                            {template.templateName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {template.templateLanguage}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge?.className ?? "bg-muted text-muted-foreground"}`}
                        >
                          {badge?.label ?? template.templateType}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-foreground">{notificationLabel}</span>
                          <span className="text-xs text-muted-foreground">
                            {template.notificationType}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-muted-foreground">
                        {headerLabel}
                      </Table.Cell>
                      <Table.Cell className="text-muted-foreground">
                        {template.variablesCount}
                      </Table.Cell>
                      <Table.Cell className="text-muted-foreground">
                        {template.buttonsCount}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-9">
                              <Ellipsis size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>

          <div className="flex items-center justify-between pt-5">
            <p className="text-sm text-muted-foreground">
              Total de{" "}
              <span className="font-medium text-foreground">{filtered.length}</span>{" "}
              registros
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                Página{" "}
                <span className="font-medium text-foreground">1</span> de{" "}
                <span className="font-medium text-foreground">1</span>
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="size-9" disabled>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="outline" size="icon" className="size-9" disabled>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card.Root>
    </div>
  );
}

export { MetaTemplatesPage };
