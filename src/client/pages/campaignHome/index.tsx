import { useParams } from "react-router";
import { Can } from "~/client/components/can";
import { KpiCards } from "./kpi-cards";
import { DonationEvolutionCard } from "./donation-evolution-card";
import { CampaignGoalCard } from "./campaign-goal-card";
import { RecentDonationsCard } from "./recent-donations-card";
import { TopDonorsCard } from "./top-donors-card";
import { PaymentMethodsCard } from "./payment-methods-card";
import { DonorProfileCard } from "./donor-profile-card";
import { ConversionFunnelCard } from "./conversion-funnel-card";
import { DonationBracketsCard } from "./donation-brackets-card";
import { MonthlyRecurrenceCard } from "./monthly-recurrence-card";
import { ChannelPerformanceCard } from "./channel-performance-card";

function CampaignHomePage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const id = campaignId ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe o desempenho desta campanha em tempo real.
        </p>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <Can permission="VIEW_FINANCIAL_METRICS">
          <DonationEvolutionCard />
          <CampaignGoalCard />
        </Can>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <RecentDonationsCard campaignId={id} />
        <TopDonorsCard campaignId={id} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Can permission="VIEW_FINANCIAL_METRICS">
          <PaymentMethodsCard />
        </Can>
        <DonorProfileCard />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ConversionFunnelCard />
        <Can permission="VIEW_FINANCIAL_METRICS">
          <DonationBracketsCard />
        </Can>
      </div>

      <MonthlyRecurrenceCard />

      {/* <ChannelPerformanceCard /> */}
    </div>
  );
}

export { CampaignHomePage };
