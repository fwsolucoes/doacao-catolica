import { ArrowLeft, Eye } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";
import { formatCurrency } from "~/lib/formatCurrency";

function CampaignBanner() {
  const { campaign } = useLoaderData<CampaignLayoutLoader>();

  return (
    <header className="flex h-[57px] shrink-0 items-center justify-between border-b border-(--border) bg-(--card) px-7">
      <div className="flex flex-col gap-0.5">
        <p className="text-xl font-semibold leading-6 text-(--text-heading)">
          {campaign.name}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant={campaign.status ? "success" : "danger"}>
            {campaign.status ? "Ativo" : "Inativo"}
          </Badge>
          <span className="text-[#cbd5e1]">•</span>
          <span className="text-(--text-muted)">
            {"Arrecadado: "}
            <span className="font-semibold text-[rgb(var(--spotlight-primary))]">
              {formatCurrency(campaign.currentRevenue)}
            </span>
            {` de ${formatCurrency(campaign.totalGoal)}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-10 min-h-0 w-auto gap-1.5 rounded-md px-3.5 text-sm text-[rgb(var(--spotlight-primary))]"
          asChild
        >
          <Link to="/my-campaigns">
            <ArrowLeft size={15} />
            Voltar para campanhas
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-lg text-[rgb(var(--spotlight-primary))]"
        >
          <Eye size={16} />
        </Button>
      </div>
    </header>
  );
}

export { CampaignBanner };
