import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import type { DonorHealthReport } from "~/client/types/donorHealthReportLoader";

type Row = DonorHealthReport["rows"][number];

const COLUMNS: { key: Exclude<keyof Row, "month" | "label">; label: string }[] = [
  { key: "revenueTotal", label: "Receita total" },
  { key: "revenueBoleto", label: "Boleto" },
  { key: "revenuePix", label: "Pix" },
  { key: "revenueCard", label: "Cartão" },
  { key: "revenueAutomaticPix", label: "Pix automático" },
  { key: "donations", label: "Doações" },
  { key: "donors", label: "Doadores" },
  { key: "loyalDonors", label: "Fiéis (6m)" },
  { key: "newLapses", label: "Novos lapsos" },
  { key: "lapsesWithoutReturn", label: "Lapsos sem retorno" },
  { key: "recovered", label: "Recuperados" },
  { key: "subscriptionsNew", label: "Subscriptions novas" },
  { key: "subscriptionsCanceled", label: "Subscriptions canceladas" },
];

function MonthlyTable({ report }: { report: DonorHealthReport }) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="donor-health-monthly">
      <div className="flex flex-col gap-1">
        <h2 id="donor-health-monthly" className="text-sm font-semibold text-(--text-heading)">
          Dados mensais
        </h2>
        <p className="text-sm text-muted-foreground">{report.periodLabel}</p>
      </div>

      <Card.Root className="p-4">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Mês</Table.Head>
              {COLUMNS.map((column) => (
                <Table.Head key={column.key} className="text-right">
                  {column.label}
                </Table.Head>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {report.rows.map((row) => (
              <Table.Row key={row.month}>
                <Table.Cell className="font-semibold">
                  {row.label}
                </Table.Cell>
                {COLUMNS.map((column) => (
                  <Table.Cell key={column.key} className="text-right tabular-nums">
                    {row[column.key]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
            {!report.rows.length && (
              <Table.Empty title="Nenhum dado no período selecionado." />
            )}
          </Table.Body>
        </Table.Root>
      </Card.Root>
    </section>
  );
}

export { MonthlyTable };
