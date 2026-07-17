import { Doughnut } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import type { CampaignHomeLoader } from "~/client/types/campaignHomeLoader";
import { formatCurrency } from "~/lib/formatCurrency";
import { BASE_CHART_OPTIONS } from "./chart-setup";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  pix: "Pix",
  automatic_pix: "Pix Automático",
  credit_card: "Cartão de Crédito",
  debit_card: "Débito",
  boleto: "Boleto",
};

const PAYMENT_METHOD_COLOR: Record<string, string> = {
  pix: "#3b82f6",
  automatic_pix: "#10b981",
  credit_card: "#8b5cf6",
  debit_card: "#f59e0b",
  boleto: "#f59e0b",
};

const FALLBACK_COLORS = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#6366f1",
];

function PaymentMethodsCard() {
  const { breakdowns } = useLoaderData<CampaignHomeLoader>();
  const { paymentMethods } = breakdowns;

  const methods = paymentMethods.map((m, i) => ({
    label: PAYMENT_METHOD_LABEL[m.paymentMethod] ?? m.paymentMethod,
    color:
      PAYMENT_METHOD_COLOR[m.paymentMethod] ??
      FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    pct: m.percentage,
    totalAmount: m.totalAmount,
    donationsCount: m.donationsCount,
  }));

  const data = {
    labels: methods.map((m) => m.label),
    datasets: [
      {
        data: methods.map((m) => m.pct),
        backgroundColor: methods.map((m) => m.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    ...BASE_CHART_OPTIONS,
    cutout: "68%",
  };

  return (
    <Card.Root className="p-6">
      <div>
        <p className="text-sm font-semibold text-(--text-heading)">
          Formas de pagamento
        </p>
        <p className="text-xs text-muted-foreground">
          Distribuição percentual e valores arrecadados por método.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative size-40 shrink-0">
          <Doughnut data={data} options={options} />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {methods.map((m) => (
            <div key={m.label} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-(--text-heading)">
                    {m.label}
                  </span>
                  <span className="text-xs font-semibold text-(--text-heading)">
                    {m.pct}%
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {formatCurrency(String(m.totalAmount))} ·{" "}
                  {m.donationsCount.toLocaleString("pt-BR")} doações
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card.Root>
  );
}

export { PaymentMethodsCard };
