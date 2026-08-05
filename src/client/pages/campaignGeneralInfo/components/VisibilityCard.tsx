import { useState, type ReactNode } from "react";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import { RadioGroup } from "~/client/components/ui/radio-group";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";
import { cn } from "~/lib/utils";

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

function VisibilityCard() {
  const { campaign } = useLoaderData<CampaignGeneralInfoLoader>();
  const [isPublic, setIsPublic] = useState(campaign.published);

  return (
    <SectionCard title="Visibilidade">
      <div className="flex flex-col gap-3">
        <RadioGroup.Root
          value={isPublic ? "public" : "private"}
          onValueChange={(v) => setIsPublic(v === "public")}
          className="flex-col sm:flex-row"
        >
          <input
            type="hidden"
            name="visibleInMarketplace"
            value={isPublic ? "true" : "false"}
          />
          {(
            [
              {
                value: "public",
                label: "Pública",
                desc: "Qualquer pessoa pode visualizar e acessar a campanha",
              },
              {
                value: "private",
                label: "Privada",
                desc: "Apenas pessoas com o link podem acessar",
              },
            ] as const
          ).map(({ value, label, desc }) => {
            const selected =
              (value === "public" && isPublic) ||
              (value === "private" && !isPublic);
            return (
              <label
                key={value}
                className={cn(
                  "flex flex-1 cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <RadioGroup.Item value={value} className="mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                </div>
              </label>
            );
          })}
        </RadioGroup.Root>
      </div>
    </SectionCard>
  );
}

export { VisibilityCard };
