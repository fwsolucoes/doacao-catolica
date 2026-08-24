import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./button";

function TabList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-1 rounded-[13px] border border-border bg-muted/60 p-1.5",
        className,
      )}
      {...props}
    />
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  className,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  count?: number;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "h-auto gap-2.5 rounded-xl px-3.5 py-1.5 text-base font-semibold",
        active
          ? "bg-[#e6e6ed] text-foreground hover:bg-[#e6e6ed] hover:text-foreground dark:bg-card dark:hover:bg-card"
          : "text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
        className,
      )}
    >
      <Icon size={20} className="shrink-0" />
      {label}
      {count !== undefined && (
        <span className="rounded-full bg-muted-foreground/15 px-2.5 py-0.5 text-xs">
          {count}
        </span>
      )}
    </Button>
  );
}

export const TabBar = { List: TabList, Button: TabButton };
