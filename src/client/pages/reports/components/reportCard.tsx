import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { cn } from "~/lib/utils";

type ReportCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "amber" | "rose" | "green" | "violet";
};

function ReportCard({
  title,
  description,
  icon: Icon,
  tone,
}: ReportCardProps) {
  const toneClass = {
    amber: "bg-[rgba(var(--spotlight-warning),0.24)] text-[rgb(var(--spotlight-warning))]",
    rose: "bg-[rgba(var(--spotlight-danger),0.16)] text-[rgb(var(--spotlight-danger))]",
    green: "bg-[rgba(var(--spotlight-success),0.18)] text-[rgb(var(--spotlight-success))]",
    violet: "bg-(--badge-violet-bg) text-(--badge-violet-text)",
  }[tone];

  return (
    <Card.Root className="gap-0 overflow-hidden rounded-lg p-0">
      <div
        className={cn(
          "flex h-42 items-center justify-center rounded-t-lg",
          toneClass,
        )}
      >
        <Icon size={54} strokeWidth={1.8} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="min-h-10 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <Button disabled className="mt-auto h-9 gap-2 rounded-lg">
          <FileText size={14} />
          Gerar relatório
        </Button>
      </div>
    </Card.Root>
  );
}

export { ReportCard };
