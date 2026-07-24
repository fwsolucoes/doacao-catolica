import { cn } from "~/lib/utils";
import { Card } from "~/client/components/ui/card";

type StatCardProps = {
  label: string;
  value: number;
  subtitle: string;
  iconBg: string;
  icon: React.ElementType;
  iconColor: string;
};

function StatCard({ label, value, subtitle, iconBg, icon: Icon, iconColor }: StatCardProps) {
  return (
    <Card.Root className="gap-0 p-0">
      <div className="flex items-center justify-between px-7 pb-3 pt-7">
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-7 pb-7">
        <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Card.Root>
  );
}

export { StatCard };
