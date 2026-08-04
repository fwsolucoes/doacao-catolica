import type { LucideIcon } from "lucide-react";
import { Separator } from "~/client/components/ui/separator";
import { cn } from "~/lib/utils";

type BreakdownItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type MetricCardProps = {
  label: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  breakdown: BreakdownItem[];
};

function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  breakdown,
}: MetricCardProps) {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card px-7">
      <div className="flex items-center justify-between pb-3 pt-7">
        <span className="text-base tracking-tight text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <Icon size={20} className={iconColor} />
        </div>
      </div>

      <div className="flex flex-col gap-0.5 pb-4">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <Separator />
      <div className="flex flex-col gap-2 py-4">
        {breakdown.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <item.icon size={14} className="shrink-0 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
            </div>
            <span className="text-xs text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { MetricCard };
export type { MetricCardProps, BreakdownItem };
