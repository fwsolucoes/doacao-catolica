import { ChevronLeft, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "~/client/components/ui/button";
import type { DonorHealthReportLoader } from "~/client/types/donorHealthReportLoader";
import "./chart-setup";
import { DonorsChart } from "./components/donorsChart";
import { Filters } from "./components/filters";
import { Glossary } from "./components/glossary";
import { KpiCards } from "./components/kpiCards";
import { LapsesChart } from "./components/lapsesChart";
import { MonthlyTable } from "./components/monthlyTable";
import { RevenueChart } from "./components/revenueChart";
import { SubscriptionsChart } from "./components/subscriptionsChart";

function DonorHealthReportPage() {
  const { campaignName, donorHealth } = useLoaderData<DonorHealthReportLoader>();
  const { campaignId } = useParams<{ campaignId: string }>();
  const [isExporting, setIsExporting] = useState(false);

  const exportParams = new URLSearchParams({
    months: String(donorHealth.windowMonths),
    lapse_months: String(donorHealth.lapseMonths),
  });
  const exportHref = `/campaign/${campaignId}/api/donor-health-export?${exportParams}`;

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
      const filename = filenameMatch?.[1] ?? "saude-da-base-de-doadores.pdf";

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
            Saúde da base de doadores
          </h1>
          <p className="text-sm text-muted-foreground">
            {campaignName} · Receitas, fidelidade e continuidade das contribuições.
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
          {isExporting ? "Exportando..." : "Exportar PDF"}
        </Button>
      </div>

      <Filters
        windowMonths={donorHealth.windowMonths}
        lapseMonths={donorHealth.lapseMonths}
      />

      <KpiCards report={donorHealth} />

      <RevenueChart report={donorHealth} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DonorsChart report={donorHealth} />
        <LapsesChart report={donorHealth} />
      </div>

      <SubscriptionsChart report={donorHealth} />

      <MonthlyTable report={donorHealth} />

      <Glossary report={donorHealth} />
    </div>
  );
}

export { DonorHealthReportPage };
