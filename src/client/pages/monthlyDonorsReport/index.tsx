import { useRef, useState } from "react";
import {
  ChevronLeft,
  Download,
  ListFilter,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import { Link, useLoaderData, useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Combobox } from "~/client/components/ui/combobox";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/client/components/ui/sheet";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import type { MonthlyDonorsReportLoader } from "~/client/types/monthlyDonorsReportLoader";

function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split("-");
  return `${monthNumber}/${year}`;
}

type FilterDraft = {
  campaignId: string;
  name: string;
  cpf: string;
};

function MonthlyDonorsReportPage() {
  const { monthlyDonors, campaigns } = useLoaderData<MonthlyDonorsReportLoader>();
  const navigate = useNavigate();
  const location = useLocation();
  const { campaignId } = useParams<{ campaignId: string }>();

  const isGeneralView = !campaignId;

  const sp = new URLSearchParams(location.search);

  const [localSearch, setLocalSearch] = useState(sp.get("search") ?? "");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const campaignSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isExporting, setIsExporting] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>({
    campaignId: "",
    name: "",
    cpf: "",
  });

  const filterKeys = isGeneralView
    ? ["project_id", "name", "cpf"]
    : ["name", "cpf"];
  const activeFilterCount = filterKeys.filter((key) => sp.get(key)).length;

  const displayStartMonth = monthlyDonors.months[0] ?? "";
  const displayEndMonth = monthlyDonors.months[monthlyDonors.months.length - 1] ?? "";

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    navigate(`?${next.toString()}`);
  }

  function handleMonthChange(field: "start_month" | "end_month", value: string) {
    if (!value) return;
    updateParams({ [field]: value });
  }

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      updateParams({ search: value || null });
    }, 500);
  }

  function handleCampaignSearch(value: string) {
    if (campaignSearchTimer.current) {
      clearTimeout(campaignSearchTimer.current);
    }
    campaignSearchTimer.current = setTimeout(() => {
      updateParams({ campaign_search: value || null });
    }, 500);
  }

  function openDrawer() {
    setDraft({
      campaignId: sp.get("project_id") ?? "",
      name: sp.get("name") ?? "",
      cpf: sp.get("cpf") ?? "",
    });
    setDrawerOpen(true);
  }

  function applyFilters() {
    updateParams({
      ...(isGeneralView ? { project_id: draft.campaignId || null } : {}),
      name: draft.name || null,
      cpf: draft.cpf || null,
    });
    setDrawerOpen(false);
  }

  function clearFilters() {
    updateParams({
      ...(isGeneralView ? { project_id: null } : {}),
      name: null,
      cpf: null,
    });
  }

  function clearAndClose() {
    clearFilters();
    setDrawerOpen(false);
  }

  const backTo = isGeneralView ? "/reports" : "../reports";

  const exportParams = new URLSearchParams(location.search);
  exportParams.set("start_month", sp.get("start_month") ?? displayStartMonth);
  exportParams.set("end_month", sp.get("end_month") ?? displayEndMonth);

  const exportHref = isGeneralView
    ? `/api/monthly-donors-export?${exportParams}`
    : `/campaign/${campaignId}/api/monthly-donors-export?${exportParams}`;

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
      const filename = filenameMatch?.[1] ?? "doacoes-mes-a-mes.xlsx";

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

  function renderExportButton(size?: "sm") {
    const content = (
      <>
        {isExporting ? (
          <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />
        ) : (
          <Download size={size === "sm" ? 14 : 16} />
        )}
        {isExporting ? "Exportando..." : "Exportar XLS"}
      </>
    );

    return (
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={handleExport}
        disabled={isExporting}
      >
        {content}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            to={backTo}
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft size={16} />
            Relatórios
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Doações Mês a Mês
          </h1>
          <p className="text-sm text-muted-foreground">
            Valores doados por cada doador em cada mês do período selecionado.
          </p>
        </div>
        {renderExportButton()}
      </div>

      <Card.Root className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Mês inicial</Label>
            <Input
              type="month"
              key={displayStartMonth}
              defaultValue={displayStartMonth}
              onChange={(e) => handleMonthChange("start_month", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Mês final</Label>
            <Input
              type="month"
              key={displayEndMonth}
              defaultValue={displayEndMonth}
              onChange={(e) => handleMonthChange("end_month", e.target.value)}
            />
          </div>
        </div>
      </Card.Root>

      <Card.Root className="gap-0 overflow-hidden p-0">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-(--text-heading)">
              Doações mês a mês ({monthlyDonors.meta.totalItems} doadores) —{" "}
              {formatMonthLabel(displayStartMonth)} a{" "}
              {formatMonthLabel(displayEndMonth)}
            </p>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1.5 text-destructive hover:brightness-100 hover:opacity-75"
                >
                  <XCircle size={14} />
                  Limpar filtros
                </Button>
              )}

              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="relative size-8"
                    onClick={openDrawer}
                  >
                    <ListFilter size={14} />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>

                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
                    {isGeneralView && (
                      <div className="flex flex-col gap-2">
                        <Label>Selecione uma campanha:</Label>
                        <Combobox
                          options={campaigns ?? []}
                          value={draft.campaignId}
                          onChange={(value) =>
                            setDraft((prev) => ({ ...prev, campaignId: value }))
                          }
                          onSearchChange={handleCampaignSearch}
                          placeholder="Selecione uma campanha"
                          searchPlaceholder="Pesquisar campanha..."
                          emptyText="Nenhuma campanha encontrada."
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Label>Nome:</Label>
                      <Input
                        value={draft.name}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Nome do doador"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>CPF:</Label>
                      <Input
                        value={draft.cpf}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, cpf: e.target.value }))
                        }
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>

                  <SheetFooter className="flex-row gap-3 px-4">
                    <Button className="flex-1" onClick={applyFilters}>
                      Aplicar
                    </Button>
                    <Button variant="ghost" className="flex-1" onClick={clearAndClose}>
                      Limpar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {renderExportButton("sm")}
            </div>
          </div>
          <div className="w-full sm:w-80">
            <Input
              leftIcon={Search}
              placeholder="Buscar por nome, CPF ou telefone..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="px-7 pb-6">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Doador</Table.Head>
                {isGeneralView && <Table.Head>Campanha</Table.Head>}
                {monthlyDonors.months.map((month) => (
                  <Table.Head key={month} className="text-right">
                    {formatMonthLabel(month)}
                  </Table.Head>
                ))}
                <Table.Head className="text-right">Total</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {monthlyDonors.donors.length === 0 ? (
                <Table.Empty
                  title="Nenhum doador encontrado."
                  description="Tente ajustar os filtros ou o período selecionado."
                />
              ) : (
                monthlyDonors.donors.map((donor) => {
                  return (
                    <Table.Row key={donor.customerId}>
                      <Table.Cell>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-foreground">
                            {donor.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{donor.document}</span>
                            <span>·</span>
                            <span>{donor.phoneDisplay}</span>
                            {donor.whatsappHref && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-6 p-0 text-[#25d366] hover:bg-transparent hover:text-[#25d366] hover:opacity-75"
                                title="Abrir no WhatsApp"
                                asChild
                              >
                                <a
                                  href={donor.whatsappHref}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <WhatsAppIcon size={14} />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                      {isGeneralView && (
                        <Table.Cell className="text-muted-foreground">
                          {donor.campaignName}
                        </Table.Cell>
                      )}
                      {monthlyDonors.months.map((month) => (
                        <Table.Cell key={month} className="text-right">
                          {donor.monthlyAmounts[month] ?? "-"}
                        </Table.Cell>
                      ))}
                      <Table.Cell className="text-right font-semibold">
                        {donor.totalAmount}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>
        </div>

        <Card.Footer className="flex-col items-center gap-3 px-6 pb-4 sm:flex-row sm:justify-between">
          <TablePagination
            currentPage={monthlyDonors.meta.page}
            totalPages={Math.max(monthlyDonors.meta.totalPages, 1)}
          />
        </Card.Footer>
      </Card.Root>
    </div>
  );
}

export { MonthlyDonorsReportPage };
