import { useRoot } from "~/client/hooks/useRoot";
import { AnnualEvolutionCard } from "./components/annualEvolutionCard";
import { FeaturedCampaignsCard } from "./components/featuredCampaignsCard";
import { KpiCards } from "./components/kpiCards";
import { PaymentMethodsCard } from "./components/paymentMethodsCard";
import { RecentDonationsCard } from "./components/recentDonationsCard";
import { WeeklyDonationsCard } from "./components/weeklyDonationsCard";

function DashboardPage() {
  const { user } = useRoot();
  const firstName = user?.name?.split(" ")[0] ?? "usuário";

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Olá, {firstName} 👋
          </h1>
          <p className="text-base text-muted-foreground">
            Aqui está o resumo das doações desta semana.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#e6e6ed] px-3 py-1.5 dark:bg-card">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-foreground">
            Tudo operando normalmente
          </span>
        </div>
      </div>

      <KpiCards />

      <div className="grid grid-cols-3 gap-5">
        <AnnualEvolutionCard />
        <PaymentMethodsCard />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <FeaturedCampaignsCard />
        <WeeklyDonationsCard />
      </div>

      <RecentDonationsCard />
    </div>
  );
}

export { DashboardPage };
