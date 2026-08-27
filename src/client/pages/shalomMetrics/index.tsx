import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Wallet,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useLoaderData } from "react-router";
import type { ShalomMetricsLoader } from "~/client/types/shalomMetricsLoader";
import { PeriodSelect } from "~/client/pages/paymentStatements/components/periodSelect";
import { FilterDrawer } from "./components/filterDrawer";
import { ShalomStatCard } from "./components/shalomStatCard";

function ShalomMetricsPage() {
  const { metrics } = useLoaderData<ShalomMetricsLoader>();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const openFilterDrawer = useCallback(() => setFilterDrawerOpen(true), []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Métricas Shalom
          </h1>
          <p className="text-sm text-muted-foreground">
            Indicadores financeiros da campanha
          </p>
        </div>
        <PeriodSelect onCustomSelect={openFilterDrawer} />
      </div>
      <FilterDrawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ShalomStatCard
          icon={CircleCheck}
          title="Total recebido online (Sistema)"
          value={metrics.receivedOnline}
          subtitle={`24% = ${metrics.receivedOnlineFee}`}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalomStatCard
          icon={Wallet}
          title="Total liberado"
          value={metrics.totalAvailable}
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <ShalomStatCard
          icon={Wallet}
          title="Aguardando liberação"
          value={metrics.pendingAvailability}
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <ShalomStatCard
          icon={CircleCheck}
          title="Total recebido offline (Na missão)"
          value={metrics.receivedOffline}
          subtitle={`Repasses: ${metrics.receivedOfflineFee} (24%)`}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalomStatCard
          icon={CircleAlert}
          title="Em atraso"
          value={metrics.overdue}
          iconBg="bg-[rgba(var(--spotlight-warning),0.1)]"
          iconColor="text-[rgb(var(--spotlight-warning))]"
        />
        <ShalomStatCard
          icon={CircleX}
          title="Taxas aplicadas"
          value={metrics.appliedFees}
          iconBg="bg-[rgba(var(--spotlight-danger),0.1)]"
          iconColor="text-[rgb(var(--spotlight-danger))]"
        />
        <ShalomStatCard
          icon={CircleCheck}
          title="Total de repasses (24%)"
          value={metrics.shalomTransfers}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalomStatCard
          icon={CircleCheck}
          title="Repasses para a Missão (76%)"
          value={metrics.missionTransfers}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
      </div>
    </div>
  );
}

export { ShalomMetricsPage };
