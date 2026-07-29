import { useState } from "react";
import { Layers, RefreshCw, Zap } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { cn } from "~/lib/utils";

type DonationType = "MONTHLY" | "ONETIME" | "BOTH";

const OPTIONS: { value: DonationType; label: string; desc: string; icon: typeof RefreshCw }[] = [
  {
    value: "MONTHLY",
    label: "Doação mensal",
    desc: "Ideal para apadrinhamento e programas contínuos com doadores recorrentes.",
    icon: RefreshCw,
  },
  {
    value: "ONETIME",
    label: "Doação única",
    desc: "Vaquinhas e doações avulsas, com meta específica e tempo definido.",
    icon: Zap,
  },
  {
    value: "BOTH",
    label: "Mensal e única",
    desc: "Combina recorrência com contribuições pontuais para máxima flexibilidade.",
    icon: Layers,
  },
];

function DonationTypeSection() {
  const [donationType, setDonationType] = useState<DonationType>("BOTH");

  return (
    <SectionCard
      title="Tipo da campanha"
      description="Escolha o modelo de arrecadação que melhor se aplica."
    >
      <input type="hidden" name="typeDonation" value={donationType} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map(({ value, label, desc, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            variant="ghost"
            onClick={() => setDonationType(value)}
            className={cn(
              "h-auto flex-col items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:brightness-100",
              donationType === value
                ? "border-primary bg-primary/5 hover:bg-primary/5"
                : "border-border hover:bg-muted/50",
            )}
          >
            <div
              className={cn(
                "flex size-[43px] items-center justify-center rounded-xl",
                donationType === value ? "bg-primary" : "bg-muted",
              )}
            >
              <Icon
                size={22}
                className={donationType === value ? "text-primary-foreground" : "text-foreground"}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          </Button>
        ))}
      </div>
    </SectionCard>
  );
}

export { DonationTypeSection };
