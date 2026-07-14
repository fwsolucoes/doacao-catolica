import { Download, Plus } from "lucide-react";
import { useMatches } from "react-router";
import { Button } from "~/client/components/ui/button";
import { DonorsSummaryCards } from "./components/summaryCards";
import { DonorsTable } from "./components/donorsTable";

function DonorsPage() {
  const matches = useMatches();
  const campaignData = matches.find(
    (m) => m.data && typeof m.data === "object" && "campaign" in m.data,
  )?.data as { campaign: { name: string } } | undefined;
  const campaignName = campaignData?.campaign?.name;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Doadores
          </h1>
          <p className="text-sm text-muted-foreground">
            Pessoas e organizações que apoiam
            {campaignName ? ` ${campaignName}` : " esta campanha"}.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline">
            <Download size={16} />
            Exportar
          </Button>
          <Button>
            <Plus size={16} />
            Adicionar
          </Button>
        </div>
      </div>

      <DonorsSummaryCards />
      <DonorsTable />
    </div>
  );
}

export { DonorsPage };
