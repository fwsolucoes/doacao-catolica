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
}[] = [
  {
    value: "MONTHLY",
    label: "Doação Mensal",
    desc: "Aceita apenas doações recorrentes mensais",
  },
  {
    value: "ONETIME",
    label: "Doação Única",
    desc: "Aceita apenas doações pontuais",
  },
  {
    value: "BOTH",
    label: "Mensal e Única",
    desc: "Aceita ambos os tipos de doação",
  },
];

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-6 p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
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
    <SectionCard title="Tipo da Campanha">
      <input type="hidden" name="typeDonation" value={donationType} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DONATION_TYPE_OPTIONS.map(({ value, label, desc }) => (
          <Button
            key={value}
            type="button"
            variant="ghost"
            onClick={() => setDonationType(value)}
            className={cn(
              "h-auto flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors hover:brightness-100",
              donationType === value
                ? "border-primary bg-primary/5 hover:bg-primary/5"
                : "border-border hover:bg-muted/50",
            )}
          >
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs text-muted-foreground">{desc}</span>
          </Button>
        ))}
      </div>
    </SectionCard>
  );
}

export { DonationTypeCard };
