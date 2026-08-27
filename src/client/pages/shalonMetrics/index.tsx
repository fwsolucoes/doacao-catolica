import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Wallet,
} from "lucide-react";
import { useLoaderData } from "react-router";
import type { ShalonMetricsLoader } from "~/client/types/shalonMetricsLoader";
import { PeriodSelect } from "~/client/pages/paymentStatements/components/periodSelect";
import { ShalonStatCard } from "./components/shalonStatCard";

function ShalonMetricsPage() {
  const { metrics } = useLoaderData<ShalonMetricsLoader>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Métricas Shalón
          </h1>
          <p className="text-sm text-muted-foreground">
            Indicadores financeiros da campanha
          </p>
        </div>
        <PeriodSelect />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ShalonStatCard
          icon={CircleCheck}
          title="Total recebido online (Sistema)"
          value={metrics.receivedOnline}
          subtitle={`24% = ${metrics.receivedOnlineFee}`}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalonStatCard
          icon={Wallet}
          title="Total liberado"
          value={metrics.totalAvailable}
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <ShalonStatCard
          icon={Wallet}
          title="Aguardando liberação"
          value={metrics.pendingAvailability}
          iconBg="bg-[rgba(var(--spotlight-info),0.1)]"
          iconColor="text-[rgb(var(--spotlight-info))]"
        />
        <ShalonStatCard
          icon={CircleCheck}
          title="Total recebido offline (Na missão)"
          value={metrics.receivedOffline}
          subtitle={`Repasses: ${metrics.receivedOfflineFee} (24%)`}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalonStatCard
          icon={CircleAlert}
          title="Em atraso"
          value={metrics.overdue}
          iconBg="bg-[rgba(var(--spotlight-warning),0.1)]"
          iconColor="text-[rgb(var(--spotlight-warning))]"
        />
        <ShalonStatCard
          icon={CircleX}
          title="Taxas aplicadas"
          value={metrics.appliedFees}
          iconBg="bg-[rgba(var(--spotlight-danger),0.1)]"
          iconColor="text-[rgb(var(--spotlight-danger))]"
        />
        <ShalonStatCard
          icon={CircleCheck}
          title="Total de repasses (24%)"
          value={metrics.shalonTransfers}
          iconBg="bg-[rgba(var(--spotlight-success),0.1)]"
          iconColor="text-[rgb(var(--spotlight-success))]"
        />
        <ShalonStatCard
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

export { ShalonMetricsPage };
