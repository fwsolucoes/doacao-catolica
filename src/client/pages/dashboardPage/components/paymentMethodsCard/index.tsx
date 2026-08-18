import { Doughnut } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import type { DashboardLoader } from "~/client/types/dashboardLoader";
import { Card } from "~/client/components/ui/card";
import "../../chart-setup";

const PAYMENT_METHOD_DISPLAY: Record<string, { label: string; color: string }> =
  {
    pix: { label: "Pix", color: "#5b4eff" },
    automatic_pix: { label: "Pix Automático", color: "#74e7bb" },
    credit_card: { label: "Cartão", color: "#6bceff" },
    bank_slip: { label: "Boleto", color: "#ffc800" },
  };

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index" as const, intersect: false },
  },
};

function PaymentMethodsCard() {
  const { paymentMethods } = useLoaderData<DashboardLoader>();

  const methodsList = (paymentMethods?.paymentMethods ?? []).map((m) => {
    const display = PAYMENT_METHOD_DISPLAY[m.paymentMethod];
    return {
      label: display?.label ?? m.paymentMethod,
      color: display?.color ?? "#9ca3af",
      pct: m.percentage,
    };
  });

  const donutData = {
    labels: methodsList.map((m) => m.label),
    datasets: [
      {
        data: methodsList.map((m) => m.pct),
        backgroundColor: methodsList.map((m) => m.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Card.Root className="gap-5 p-7">
      <div>
        <p className="text-lg font-semibold tracking-tight text-foreground">
          Formas de Pagamento
        </p>
        <p className="text-sm text-muted-foreground">
          Distribuição das doações por método de pagamento.
        </p>
      </div>
      <div className="relative mx-auto size-48 shrink-0">
        <Doughnut data={donutData} options={donutOptions} />
      </div>
      <div className="flex flex-col gap-2">
        {methodsList.map((m) => (
          <div key={m.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="size-3 shrink-0 rounded-sm"
                style={{ backgroundColor: m.color }}
              />
              <span className="text-base text-foreground">{m.label}</span>
            </div>
            <span className="text-base text-muted-foreground">{m.pct}%</span>
          </div>
        ))}
      </div>
    </Card.Root>
  );
}

export { PaymentMethodsCard };
