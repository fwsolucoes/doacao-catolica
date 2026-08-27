import { ArrowLeft, Eye, Moon, Sun } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { SidebarTrigger } from "~/client/components/ui/sidebar";
import { useRoot } from "~/client/hooks/useRoot";
import { useTheme } from "~/client/hooks/useTheme";
import type { CampaignLayoutLoader } from "~/client/types/campaignLayoutLoader";
import { formatCurrency } from "~/lib/formatCurrency";

function CampaignBanner() {
  const { campaign, overview, bannerTotalReceived } = useLoaderData<CampaignLayoutLoader>();
  const { theme, toggle } = useTheme();
  const { SANCTON_DONATION_CHECKOUT_URL } = useRoot().environmentVariables;
  const checkoutUrl = `${SANCTON_DONATION_CHECKOUT_URL}/${campaign.slug}`;

  return (
    <header className="sticky top-0 z-30 flex min-h-14 w-full items-center gap-3 border-b border-border bg-background px-7 py-4">
      <SidebarTrigger className="shrink-0 text-foreground" />
      <div className="h-10 w-px shrink-0 bg-border" />
      <Button
        variant="ghost"
        size="icon"
        className="size-10 shrink-0"
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
        <div className="flex min-w-0 items-center gap-2.5 text-base">
          <span
            className={`shrink-0 font-semibold text-base ${campaign.status ? "text-[#1f7a4d]" : "text-destructive"}`}
          >
            {campaign.status ? "Ativa" : "Inativa"}
          </span>
          <span className="shrink-0 text-(--text-muted)/50">•</span>
          <span className="truncate text-(--text-muted)">
            {"Arrecadado: "}
            <span className="font-semibold text-foreground">
              {bannerTotalReceived ?? formatCurrency(String(overview.totalRaised))}
            </span>
            {(() => {
              const isMonthly = campaign.typeDonation === "BOTH" || campaign.typeDonation === "MONTHLY";
              if (isMonthly) {
                return overview.monthlyGoal
                  ? ` de ${formatCurrency(String(overview.monthlyGoal))}`
                  : " · Meta mensal não definida";
              }
              return campaign.totalGoal ? ` de ${formatCurrency(String(campaign.totalGoal))}` : null;
            })()}
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex shrink-0 items-center gap-1.5">
        <Button variant="ghost" size="icon" className="size-10" onClick={toggle} aria-label="Alternar tema">
          {theme === "light" ? (
            <Moon key="moon" size={16} className="animate-theme-icon-in text-foreground" />
          ) : (
            <Sun key="sun" size={16} className="animate-theme-icon-in text-foreground" />
          )}
        </Button>
        {/* <Button variant="ghost" size="icon" className="relative size-10">
          <Bell size={16} className="text-foreground" />
          <span className="absolute right-2 top-2 size-2.5 rounded-full bg-[#3a64f2]" />
        </Button> */}
        <Button variant="ghost" size="icon" className="size-10" aria-label="Visualizar campanha" asChild>
          <a href={checkoutUrl} target="_blank" rel="noreferrer">
            <Eye size={16} className="text-foreground" />
          </a>
        </Button>
      </div>
    </header>
  );
}

export { CampaignBanner };
