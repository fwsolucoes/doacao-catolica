import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  CheckCircle2,
  CirclePercent,
  Clock,
  Wifi,
  XCircle,
} from "lucide-react";
import { Card } from "~/client/components/ui/card";

type MetricColor =
  | "teal"
  | "primary"
  | "success"
  | "danger"
  | "info"
  | "accent"
  | "warning";

type MetricCardData = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: MetricColor;
};

const metrics: MetricCardData[] = [
  {
    label: "Total recebido online",
    value: "R$ 48.320,00",
    icon: Wifi,
    color: "teal",
  },
  {
    label: "Total liberado",
    value: "R$ 31.750,00",
    icon: CheckCircle2,
    color: "success",
  },
  {
    label: "Aguardando liberação",
    value: "R$ 12.480,00",
    icon: Clock,
    color: "warning",
  },
  {
    label: "Pendentes",
    value: "R$ 4.090,00",
    icon: AlertCircle,
    color: "info",
  },
  {
    label: "Total recebido offline",
    value: "R$ 9.600,00",
    icon: Banknote,
    color: "primary",
  },
  {
    label: "Em atraso",
    value: "R$ 2.150,00",
    icon: AlertTriangle,
    color: "danger",
  },
  {
    label: "Cancelados",
    value: "R$ 1.340,00",
    icon: XCircle,
    color: "danger",
  },
  {
    label: "Taxas aplicadas",
    value: "R$ 1.920,00",
    icon: CirclePercent,
    color: "accent",
  },
];

function PaymentStatementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-(--text-heading)">
        Extratos de pagamentos
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card.Root key={metric.label} className="gap-3 p-5">
            <Card.MetricHeader
              label={metric.label}
              icon={metric.icon}
              color={metric.color}
            />
            <Card.MetricValue>{metric.value}</Card.MetricValue>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}

export { PaymentStatementsPage };
