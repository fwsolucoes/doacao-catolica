import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { cn } from "~/lib/utils";

type ReportCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "amber" | "rose" | "green" | "violet" | "blue";
  navigateTo?: string;
};

function ReportCard({
  title,
  description,
  icon: Icon,
  tone,
  navigateTo,
}: ReportCardProps) {
  const toneClass = {
    amber: "bg-[rgba(var(--spotlight-warning),0.24)] text-[rgb(var(--spotlight-warning))]",
    rose: "bg-[rgba(var(--spotlight-danger),0.16)] text-[rgb(var(--spotlight-danger))]",
    green: "bg-[rgba(var(--spotlight-success),0.18)] text-[rgb(var(--spotlight-success))]",
    violet: "bg-(--badge-violet-bg) text-(--badge-violet-text)",
    blue: "bg-[rgba(var(--spotlight-primary),0.12)] text-[rgb(var(--spotlight-primary))]",
  }[tone];

  const content = (
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

        {navigateTo ? (
          <Button asChild className="mt-auto h-9 gap-2 rounded-lg">
            <span>
              <FileText size={14} />
              Gerar relatório
            </span>
          </Button>
        ) : (
          <Button disabled className="mt-auto h-9 gap-2 rounded-lg">
            <FileText size={14} />
            Gerar relatório
          </Button>
        )}
      </div>
    </Card.Root>
  );

  if (!navigateTo) return content;

  return (
    <Link
      to={navigateTo}
      className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}

export { ReportCard };
