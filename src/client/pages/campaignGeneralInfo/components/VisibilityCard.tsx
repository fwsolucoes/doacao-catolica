import { Check, Globe, Lock } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLoaderData } from "react-router";
import { Card } from "~/client/components/ui/card";
import { RadioGroup } from "~/client/components/ui/radio-group";
import type { CampaignGeneralInfoLoader } from "~/client/types/campaignGeneralInfoLoader";
import { cn } from "~/lib/utils";

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

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Pública",
    description:
      "A campanha é listada no site Doação Católica e pode ser encontrada por qualquer pessoa.",
    icon: Globe,
  },
  {
    value: "private",
    label: "Privada",
    description:
      "A campanha só é acessível pelo link direto e não aparece nas listagens públicas.",
    icon: Lock,
  },
] as const;

function VisibilityCard() {
  const { campaign } = useLoaderData<CampaignGeneralInfoLoader>();
  const [isPublic, setIsPublic] = useState(campaign.visibleInMarketplace);

  return (
    <SectionCard
      title="Visibilidade"
      description="Defina se esta campanha aparece publicamente no site Doação Católica."
    >
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
        {VISIBILITY_OPTIONS.map(({ value, label, description, icon: Icon }) => {
          const selected =
            (value === "public" && isPublic) ||
            (value === "private" && !isPublic);
          return (
            <label
              key={value}
              className={cn(
                "relative flex flex-1 cursor-pointer items-start gap-3.5 rounded-xl border p-5 transition-colors",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <RadioGroup.Item value={value} className="sr-only" />
              <span
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-xl p-2.5",
                  selected ? "bg-primary" : "bg-muted",
                )}
              >
                <Icon
                  size={24}
                  className={
                    selected ? "text-primary-foreground" : "text-muted-foreground"
                  }
                />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              </div>
              {selected && (
                <span className="absolute top-3.5 right-3.5 flex size-6 items-center justify-center rounded-full bg-primary">
                  <Check size={14} className="text-primary-foreground" />
                </span>
              )}
            </label>
          );
        })}
      </RadioGroup.Root>
    </SectionCard>
  );
}

export { VisibilityCard };
