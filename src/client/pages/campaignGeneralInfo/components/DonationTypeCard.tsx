import {
  Check,
  HandCoins,
  Repeat,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLoaderData } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";
import { cn } from "~/lib/utils";

type DonationType = "MONTHLY" | "ONETIME" | "BOTH";

const DONATION_TYPE_OPTIONS: {
  value: DonationType;
  label: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  {
    value: "MONTHLY",
    label: "Doação mensal",
    desc: "Ideal para apadrinhamento e programas contínuos com doadores recorrentes.",
    icon: Repeat,
  },
  {
    value: "ONETIME",
    label: "Doação única",
    desc: "Vaquinhas e doações avulsas, com meta específica e tempo definido.",
    icon: HandCoins,
  },
  {
    value: "BOTH",
    label: "Mensal e única",
    desc: "Combina recorrência com contribuições pontuais para máxima flexibilidade.",
    icon: Sparkles,
  },
];

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </Card.Root>
  );
}

function DonationTypeCard() {
  const { campaign } = useLoaderData<CampaignGeneralInfoLoader>();
  const [donationType, setDonationType] = useState<DonationType>(
    (campaign.typeDonation as DonationType) || "ONETIME",
  );

  return (
    <SectionCard
      title="Tipo da Campanha"
      description="Escolha o modelo de arrecadação que melhor se aplica."
    >
      <input type="hidden" name="typeDonation" value={donationType} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DONATION_TYPE_OPTIONS.map(({ value, label, desc, icon: Icon }) => {
          const selected = donationType === value;
          return (
            <Button
              key={value}
              type="button"
              variant="ghost"
              onClick={() => setDonationType(value)}
              className={cn(
                "relative h-auto flex-col items-start gap-3.5 rounded-xl border p-5 text-left transition-colors hover:brightness-100",
                selected
                  ? "border-primary bg-primary/5 hover:bg-primary/5"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-xl p-2.5",
                  selected ? "bg-primary" : "bg-muted",
                )}
              >
                <Icon
                  size={24}
                  className={
                    selected
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }
                />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {label}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {desc}
                </span>
              </div>
              {selected && (
                <span className="absolute top-3.5 right-3.5 flex size-6 items-center justify-center rounded-full bg-primary">
                  <Check size={14} className="text-primary-foreground" />
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </SectionCard>
  );
}

export { DonationTypeCard };
