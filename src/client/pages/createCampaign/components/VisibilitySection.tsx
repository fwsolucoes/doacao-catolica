import { useState } from "react";
import { SectionCard } from "~/client/components/campaignSettings/sectionCard";
import { RadioGroup } from "~/client/components/ui/radio-group";
import { cn } from "~/lib/utils";

const OPTIONS = [
  {
    value: "public",
    label: "Pública",
    desc: "Qualquer pessoa pode visualizar e acessar a campanha.",
  },
  {
    value: "private",
    label: "Privada",
    desc: "Apenas pessoas com o link podem acessar.",
  },
] as const;

function VisibilitySection() {
  const [isPublic, setIsPublic] = useState(true);

  return (
    <SectionCard
      title="Visibilidade"
      description="Defina quem pode visualizar e acessar esta campanha."
    >
      <input type="hidden" name="published" value={isPublic ? "true" : "false"} />
      <RadioGroup.Root
        value={isPublic ? "public" : "private"}
        onValueChange={(v) => setIsPublic(v === "public")}
        className="flex-col sm:flex-row"
      >
        {OPTIONS.map(({ value, label, desc }) => {
          const selected =
            (value === "public" && isPublic) || (value === "private" && !isPublic);
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
    </SectionCard>
  );
}

export { VisibilitySection };
