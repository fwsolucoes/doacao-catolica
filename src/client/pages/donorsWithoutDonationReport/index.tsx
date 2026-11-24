import { useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  CircleDollarSign,
  Download,
  Loader2,
  Repeat2,
  Search,
  UserRoundX,
} from "lucide-react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { toast } from "sonner";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import type { DonorsWithoutDonationReportLoader } from "~/client/types/donorsWithoutDonationReportLoader";
import { PeriodSelect } from "./components/periodSelect";

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral"
  | "violet"
  | "emerald"
  | "navy"
  | "amber"
  | "rose";

const TYPE_BADGE: Record<string, BadgeVariant> = {
  Recorrente: "violet",
  Pontual: "navy",
};

const PAYMENT_METHOD_BADGE: Record<string, BadgeVariant> = {
  Pix: "emerald",
  "Pix automático": "emerald",
  Cartão: "navy",
  Boleto: "amber",
  Manual: "neutral",
};

function DonorsWithoutDonationReportPage() {
  const { registrationsWithoutDonations } =
    useLoaderData<DonorsWithoutDonationReportLoader>();
  const { summary, registrations, meta } = registrationsWithoutDonations;
  const navigate = useNavigate();
  const location = useLocation();
  const { campaignId } = useParams<{ campaignId: string }>();

  const sp = new URLSearchParams(location.search);
  const [localSearch, setLocalSearch] = useState(sp.get("search") ?? "");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isExporting, setIsExporting] = useState(false);

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const next = new URLSearchParams(location.search);
      if (value) next.set("search", value);
      else next.delete("search");
      next.delete("page");
      navigate(`?${next.toString()}`);
    }, 500);
  }

  const exportHref = `/campaign/${campaignId}/api/donors-without-donation-export${location.search}`;

  async function handleExport() {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const response = await fetch(exportHref);
      if (!response.ok) throw new Error("export failed");

      const blob = await response.blob();
      const filenameMatch = response.headers
        .get("Content-Disposition")
        ?.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch?.[1] ?? "doadores-sem-contribuicao.xlsx";

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Não foi possível gerar o arquivo. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            to="../reports"
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft size={16} />
            Relatórios
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Doadores sem contribuição
          </h1>
          <p className="text-sm text-muted-foreground">
            Pessoas que se cadastraram na campanha, mas ainda não concluíram
            nenhuma doação.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {isExporting ? "Exportando..." : "Exportar XLS"}
        </Button>
      </div>

      <Card.Root className="p-6">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold">Período de cadastro</Label>
          <PeriodSelect />
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card.Root className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--spotlight-warning),0.24)] text-[rgb(var(--spotlight-warning))]">
              <UserRoundX size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Cadastros sem doações
              </p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">
                {summary.totalCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Nenhuma doação realizada
              </p>
            </div>
          </div>
        </Card.Root>

        <Card.Root className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--badge-violet-bg) text-(--badge-violet-text)">
              <Repeat2 size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Recorrentes</p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">
                {summary.recurringCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Intenção de contribuir mensalmente
              </p>
            </div>
          </div>
        </Card.Root>

        <Card.Root className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--badge-navy-bg) text-(--badge-navy-text)">
              <CalendarDays size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Pontuais</p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">
                {summary.oneTimeCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Intenção de doação única
              </p>
            </div>
          </div>
        </Card.Root>

        <Card.Root className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--spotlight-success),0.18)] text-[rgb(var(--spotlight-success))]">
              <CircleDollarSign size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Potencial mensal
              </p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">
                {summary.monthlyPotentialAmount}
              </p>
              <p className="text-xs text-muted-foreground">
                Valores recorrentes escolhidos
              </p>
            </div>
          </div>
        </Card.Root>
      </div>

      <Card.Root className="gap-0 overflow-hidden p-0">
        <div className="flex flex-col gap-4 p-6">
          <p className="text-sm font-semibold text-(--text-heading)">
            Cadastros por data ({meta.totalItems})
          </p>
          <div className="w-full sm:w-80">
            <Input
              leftIcon={Search}
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="px-7 pb-6">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nome</Table.Head>
                <Table.Head>CPF/CNPJ</Table.Head>
                <Table.Head>Telefone</Table.Head>
                <Table.Head>E-mail</Table.Head>
                <Table.Head className="text-right">
                  Valor escolhido
                </Table.Head>
                <Table.Head>Forma de pagamento</Table.Head>
                <Table.Head>Tipo</Table.Head>
                <Table.Head>Data de cadastro</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {registrations.length === 0 ? (
                <Table.Empty
                  title="Nenhum cadastro encontrado."
                  description="Tente ajustar o filtro de busca ou o período selecionado."
                />
              ) : (
                registrations.map((registration) => (
                  <Table.Row key={registration.customerId}>
                    <Table.Cell className="font-semibold">
                      {registration.name}
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      {registration.document}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {registration.phoneDisplay}
                        {registration.whatsappHref && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-6 p-0 text-[#25d366] hover:bg-transparent hover:text-[#25d366] hover:opacity-75"
                            title="Abrir no WhatsApp"
                            asChild
                          >
                            <a
                              href={registration.whatsappHref}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <WhatsAppIcon size={14} />
                            </a>
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      {registration.email}
                    </Table.Cell>
                    <Table.Cell className="text-right font-semibold">
                      {registration.chosenAmount}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant={
                          PAYMENT_METHOD_BADGE[registration.paymentMethod] ??
                          "neutral"
                        }
                      >
                        {registration.paymentMethod}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={TYPE_BADGE[registration.type] ?? "neutral"}>
                        {registration.type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      {registration.registeredAt}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </div>

        <Card.Footer className="flex-col items-center gap-3 px-6 pb-4 sm:flex-row sm:justify-between">
          <TablePagination
            currentPage={meta.page}
            totalPages={Math.max(meta.totalPages, 1)}
          />
        </Card.Footer>
      </Card.Root>
    </div>
  );
}

export { DonorsWithoutDonationReportPage };
