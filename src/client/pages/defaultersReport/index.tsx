import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  CircleDollarSign,
  Download,
  FileText,
  ListFilter,
  Search,
  UserX,
  XCircle,
} from "lucide-react";
import { Link, useLoaderData, useLocation, useNavigate, useParams } from "react-router";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Label } from "~/client/components/ui/label";
import { Select } from "~/client/components/ui/select";
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
import type { DefaultersReportLoader } from "~/client/types/defaultersReportLoader";

function DefaultersReportPage() {
  const { defaultingDonors, months: currentMonths, campaigns } =
    useLoaderData<DefaultersReportLoader>();
  const navigate = useNavigate();
  const location = useLocation();
  const { campaignId } = useParams<{ campaignId: string }>();

  const isGeneralView = !campaignId;

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftCampaign, setDraftCampaign] = useState("");

  const sp = new URLSearchParams(location.search);
  const activeCampaignId = sp.get("account_uuid") ?? "";

  const filtered = defaultingDonors.donors.filter(
    (d) =>
      search === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.phoneDisplay.toLowerCase().includes(search.toLowerCase()),
  );

  function handleMonthsChange(value: string) {
    const nextSp = new URLSearchParams(location.search);
    nextSp.set("months", value);
    navigate(`?${nextSp.toString()}`);
  }

  function openDrawer() {
    setDraftCampaign(activeCampaignId);
    setDrawerOpen(true);
  }

  function applyFilters() {
    const nextSp = new URLSearchParams(location.search);
    if (draftCampaign) nextSp.set("account_uuid", draftCampaign);
    else nextSp.delete("account_uuid");
    navigate(`?${nextSp.toString()}`);
    setDrawerOpen(false);
  }

  function clearFilters() {
    const nextSp = new URLSearchParams(location.search);
    nextSp.delete("account_uuid");
    navigate(`?${nextSp.toString()}`);
  }

  function clearAndClose() {
    clearFilters();
    setDrawerOpen(false);
  }

  const backTo = isGeneralView ? "/reports" : "../reports";

  const exportHref = campaignId
    ? `/campaign/${campaignId}/api/defaulters-export?months=${currentMonths}`
    : null;

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
            Doadores Inadimplentes
          </h1>
          <p className="text-sm text-muted-foreground">
            Doadores com doações sem pagamento nos últimos {currentMonths} meses
            e valores pendentes na campanha.
          </p>
        </div>
        {exportHref && (
          <Button variant="outline" asChild>
            <a href={exportHref}>
              <Download size={16} />
              Exportar XLS
            </a>
          </Button>
        )}
      </div>

      <Card.Root className="p-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-foreground">
            Quantidade de últimos meses sem pagamento
          </span>
          <Select.Root value={String(currentMonths)} onValueChange={handleMonthsChange}>
            <Select.Trigger className="w-52">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                <Select.Item key={n} value={String(n)}>
                  {n} {n === 1 ? "mês" : "meses"}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card.Root className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--spotlight-danger),0.16)] text-[rgb(var(--spotlight-danger))]">
              <UserX size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Total de inadimplentes
              </p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">
                {defaultingDonors.totalDefaultingDonors}
              </p>
              <p className="text-xs text-muted-foreground">
                Doadores com pagamentos em aberto
              </p>
            </div>
          </div>
        </Card.Root>

        <Card.Root className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--spotlight-warning),0.24)] text-[rgb(var(--spotlight-warning))]">
              <CalendarDays size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Total médio por mês
              </p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">
                {defaultingDonors.averageMonthlyAmount}
              </p>
              <p className="text-xs text-muted-foreground">
                Média mensal do valor pendente ({currentMonths} meses)
              </p>
            </div>
          </div>
        </Card.Root>

        <Card.Root className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--badge-violet-bg) text-(--badge-violet-text)">
              <CircleDollarSign size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Total médio por doador
              </p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">
                {defaultingDonors.averageAmountPerDonor}
              </p>
              <p className="text-xs text-muted-foreground">
                Total pendente: {defaultingDonors.totalPendingAmount}
              </p>
            </div>
          </div>
        </Card.Root>
      </div>

      <Card.Root className="gap-0 overflow-hidden p-0">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-(--text-heading)">
              Doadores inadimplentes ({defaultingDonors.totalDefaultingDonors}){" "}
              — Últimos {currentMonths} meses
            </p>
            <div className="flex items-center gap-2">
              {isGeneralView && (
                <>
                  {activeCampaignId && (
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
                        {activeCampaignId && (
                          <span className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                            1
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>

                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                      </SheetHeader>

                      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
                        <div className="flex flex-col gap-2">
                          <Label>Campanha:</Label>
                          <Select.Root value={draftCampaign} onValueChange={setDraftCampaign}>
                            <Select.Trigger>
                              <Select.Value placeholder="Todas" />
                            </Select.Trigger>
                            <Select.Content position="popper">
                              <Select.Item value="">Todas</Select.Item>
                              {(campaigns ?? []).map((campaign) => (
                                <Select.Item key={campaign.id} value={campaign.id}>
                                  {campaign.name}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
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
                </>
              )}

              {exportHref && (
                <Button variant="outline" size="sm" asChild>
                  <a href={exportHref}>
                    <Download size={14} />
                    Exportar XLS
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="w-full sm:w-80">
            <Input
              leftIcon={Search}
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="px-7 pb-6">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nome</Table.Head>
                <Table.Head>Telefone</Table.Head>
                <Table.Head>E-mail</Table.Head>
                <Table.Head className="text-right">
                  Doações sem pagamento ({currentMonths}m)
                </Table.Head>
                <Table.Head className="text-right">Valor pendente</Table.Head>
                <Table.Head>Cadastro</Table.Head>
                <Table.Head className="text-right">
                  Doações na campanha
                </Table.Head>
                <Table.Head className="text-center">Ações</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.length === 0 ? (
                <Table.Empty
                  title="Nenhum doador encontrado."
                  description="Tente ajustar o filtro de busca ou o período selecionado."
                />
              ) : (
                filtered.map((defaulter) => {
                  const extratoTo = campaignId
                    ? `/campaign/${campaignId}/donations?payments%3Asearch=${defaulter.name}&start_date=1980-01-01&end_date=2099-12-31&period=custom`
                    : `/donations?payments%3Asearch=${defaulter.name}&start_date=1980-01-01&end_date=2099-12-31&period=custom`;

                  return (
                    <Table.Row key={defaulter.customerId}>
                      <Table.Cell className="font-semibold">
                        {defaulter.name}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {defaulter.phoneDisplay}
                          {defaulter.whatsappHref && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-6 p-0 text-[#25d366] hover:bg-transparent hover:text-[#25d366] hover:opacity-75"
                              title="Abrir no WhatsApp"
                              asChild
                            >
                              <a
                                href={defaulter.whatsappHref}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <WhatsAppIcon size={16} />
                              </a>
                            </Button>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-muted-foreground">
                        {defaulter.email}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <span className="inline-flex items-center justify-center rounded-full bg-destructive/15 px-3 py-0.5 text-xs font-semibold text-destructive">
                          {defaulter.unpaidDonationsCount}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-right font-semibold">
                        {defaulter.pendingAmount}
                      </Table.Cell>
                      <Table.Cell className="text-muted-foreground">
                        {defaulter.createdAt}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <span className="font-semibold">
                          {defaulter.totalPaidAmount}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          · {defaulter.totalPaidDonationsCount}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          asChild
                        >
                          <Link to={extratoTo}>
                            <FileText size={14} />
                            Extrato
                          </Link>
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>
        </div>

        <Card.Footer className="flex-col items-center gap-3 px-6 pb-4 sm:flex-row sm:justify-between">
          <TablePagination currentPage={1} totalPages={1} />
        </Card.Footer>
      </Card.Root>
    </div>
  );
}

export { DefaultersReportPage };
