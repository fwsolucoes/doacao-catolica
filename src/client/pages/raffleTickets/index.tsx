import { ArrowLeft, Download, Loader2, Search, Ticket } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import { useFilter } from "~/client/hooks/useFilter";
import type { RaffleTicketsLoader } from "~/client/types/raffleTicketsLoader";

function RaffleTicketsPage() {
  const { raffle, tickets } = useLoaderData<RaffleTicketsLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const { getParam, handleChangeTimeoutFilter } = useFilter("tickets");
  const [isExporting, setIsExporting] = useState(false);

  const search = getParam("search") ?? "";
  const exportParams = new URLSearchParams();
  if (search) exportParams.set("search", search);
  const exportQuery = exportParams.toString();
  const exportHref = `/campaign/${campaignId}/api/raffle-tickets-export/${raffle.id}${exportQuery ? `?${exportQuery}` : ""}`;

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
      const filename = filenameMatch?.[1] ?? "bilhetes-sorteio.xlsx";

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
            to={`/campaign/${campaignId}/raffles`}
            className="flex w-fit items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Voltar para sorteios
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Bilhetes · {raffle.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Bilhetes adquiridos neste sorteio.
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

      <Card.Root className="gap-6 p-6">
        <div className="w-full sm:max-w-144">
          <Input
            leftIcon={Search}
            placeholder="Buscar por número ou nome…"
            defaultValue={search}
            onChange={(e) => handleChangeTimeoutFilter("search", e.target.value)}
          />
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Número</Table.Head>
              <Table.Head>Nome</Table.Head>
              <Table.Head>Data</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.data.map((ticket) => (
              <Table.Row key={ticket.id}>
                <Table.Cell className="font-mono font-semibold">
                  {ticket.numberLabel}
                </Table.Cell>
                <Table.Cell>{ticket.customerName}</Table.Cell>
                <Table.Cell>{ticket.createdAt}</Table.Cell>
              </Table.Row>
            ))}
            {!tickets.data.length && (
              <Table.Empty
                icon={<Ticket />}
                title="Nenhum bilhete encontrado."
                description={
                  search
                    ? "Tente buscar por outro número ou nome."
                    : "Os bilhetes aparecem aqui assim que as doações forem confirmadas."
                }
              />
            )}
          </Table.Body>
        </Table.Root>

        {tickets.meta.totalPages > 1 && (
          <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <TablePagination
              currentPage={tickets.meta.page}
              totalPages={tickets.meta.totalPages}
              pageParam="tickets:page"
            />
          </Card.Footer>
        )}
      </Card.Root>
    </div>
  );
}

export { RaffleTicketsPage };
