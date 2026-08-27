import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

type ShalomStatCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  iconBg: string;
  iconColor: string;
};

function ShalomStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  iconBg,
  iconColor,
}: ShalomStatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          iconBg,
        )}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-muted-foreground">{title}</span>
        <p className="text-xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

export { ShalomStatCard };
export type { ShalomStatCardProps };
