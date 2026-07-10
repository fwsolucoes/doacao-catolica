import { ArrowLeft, Bell, Eye, Moon } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { SidebarTrigger } from "~/client/components/ui/sidebar";
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";
import { formatCurrency } from "~/lib/formatCurrency";

function CampaignBanner() {
  const { campaign } = useLoaderData<CampaignLayoutLoader>();

  return (
    <header className="sticky top-0 z-30 flex min-h-14 w-full items-center gap-3 border-b border-border bg-card/80 px-7 py-4 backdrop-blur-sm">
      <SidebarTrigger className="shrink-0 text-foreground" />
      <div className="h-10 w-px shrink-0 bg-border" />
      <Button
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 rounded-xl"
        asChild
      >
        <Link to="/my-campaigns">
          <ArrowLeft size={16} className="text-muted-foreground" />
        </Link>
      </Button>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-xl font-semibold leading-6 text-foreground">
          {campaign.name}
        </p>
        <div className="flex items-center gap-2.5 text-base">
          <span
            className={`font-semibold text-base ${campaign.status ? "text-[#1f7a4d]" : "text-destructive"}`}
          >
            {campaign.status ? "Ativa" : "Inativa"}
          </span>
          <span className="text-(--text-muted)/50">•</span>
          <span className="text-(--text-muted)">
            {"Arrecadado: "}
            <span className="font-semibold text-foreground">
              {formatCurrency(campaign.currentRevenue)}
            </span>
            {` de ${formatCurrency(campaign.totalGoal)}`}
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex shrink-0 items-center gap-1.5">
        <Button variant="ghost" size="icon" className="size-10 rounded-xl">
          <Moon size={16} className="text-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-10 rounded-xl"
        >
          <Bell size={16} className="text-foreground" />
          <span className="absolute right-2 top-2 size-2.5 rounded-full bg-[#3a64f2]" />
        </Button>
        <Button variant="ghost" size="icon" className="size-10 rounded-xl">
          <Eye size={16} className="text-foreground" />
        </Button>
      </div>
    </header>
  );
}

export { CampaignBanner };
