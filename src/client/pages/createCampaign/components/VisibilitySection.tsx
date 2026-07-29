import { useState } from "react";
import { Check, Globe, Lock } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { cn } from "~/lib/utils";

type Visibility = "public" | "private";

const OPTIONS: { value: Visibility; label: string; desc: string; icon: typeof Globe }[] = [
  {
    value: "public",
    label: "Pública",
    desc: "A campanha é listada no site Doação Católica e pode ser encontrada por qualquer pessoa.",
    icon: Globe,
  },
  {
    value: "private",
    label: "Privada",
    desc: "A campanha só é acessível pelo link direto e não aparece nas listagens públicas.",
    icon: Lock,
  },
];

function VisibilitySection() {
  const [visibility, setVisibility] = useState<Visibility>("public");

  return (
    <SectionCard
      title="Visibilidade"
      description="Defina se esta campanha aparece publicamente no site Doação Católica."
    >
      <input type="hidden" name="published" value={visibility === "public" ? "true" : "false"} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTIONS.map(({ value, label, desc, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            variant="ghost"
            onClick={() => setVisibility(value)}
            className={cn(
              "relative h-auto items-start gap-4 rounded-xl border p-4 text-left transition-colors hover:brightness-100",
              visibility === value
                ? "border-primary bg-primary/5 hover:bg-primary/5"
                : "border-border hover:bg-muted/50",
            )}
          >
            {visibility === value && (
              <div className="absolute right-3.5 top-3.5 flex size-5 items-center justify-center rounded-full bg-primary">
                <Check size={11} className="text-primary-foreground" strokeWidth={2.5} />
              </div>
            )}
            <div
              className={cn(
                "flex size-[43px] shrink-0 items-center justify-center rounded-xl",
                visibility === value ? "bg-primary" : "bg-muted",
              )}
            >
              <Icon
                size={22}
                className={visibility === value ? "text-primary-foreground" : "text-foreground"}
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

export { VisibilitySection };
