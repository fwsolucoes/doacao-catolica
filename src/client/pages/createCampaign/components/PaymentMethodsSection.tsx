import { useState } from "react";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { Switch } from "~/client/components/ui/switch";

const PAYMENT_METHODS = [
  {
    key: "pix",
    label: "Pix",
    description: "Aprovação instantânea, sem taxas de intermediação.",
  },
  {
    key: "boleto",
    label: "Boleto bancário",
    description: "Compensação em até 3 dias úteis.",
  },
  {
    key: "creditCard",
    label: "Cartão de crédito",
    description: "Doações únicas e recorrentes em até 12x.",
  },
] as const;

type PaymentKey = (typeof PAYMENT_METHODS)[number]["key"];

function PaymentMethodsSection() {
  const [enabled, setEnabled] = useState<Record<PaymentKey, boolean>>({
    pix: true,
    boleto: true,
    creditCard: true,
  });

  function toggle(key: PaymentKey) {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <SectionCard
      title="Formas de pagamento"
      description="Habilite os métodos disponíveis para os doadores."
    >
      {PAYMENT_METHODS.map(({ key, label, description }) => (
        <div
          key={key}
          className="flex items-center justify-between gap-6 rounded-xl border border-border p-4"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
          <input type="hidden" name={key} value={enabled[key] ? "true" : "false"} />
          <Switch
            checked={enabled[key]}
            onCheckedChange={() => toggle(key)}
            className="shrink-0"
          />
        </div>
      ))}
    </SectionCard>
  );
}

export { PaymentMethodsSection };
