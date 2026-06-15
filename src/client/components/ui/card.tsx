import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import { cn } from "~/lib/utils";
import type { ComponentProps } from "react";

function Root({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-lg border border-(--border) bg-(--card) p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    />
  );
}

function Header({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-center justify-between gap-5", className)}
      {...props}
    />
  );
}

function Content({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-6", className)} {...props} />;
}

function Footer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center border-t border-(--border) pt-5", className)}
      {...props}
    />
  );
}

// --- Metric sub-components ---

type MetricColor =
  | "teal"
  | "primary"
  | "success"
  | "danger"
  | "info"
  | "accent"
  | "warning";

const metricIconStyles = tv({
  slots: {
    wrapper: "flex shrink-0 items-center justify-center rounded-lg size-11",
    icon: "",
  },
  variants: {
    color: {
      teal: {
        wrapper: "bg-[rgba(var(--spotlight-teal),0.1)]",
        icon: "text-[rgb(var(--spotlight-teal))]",
      },
      primary: {
        wrapper: "bg-[rgba(var(--spotlight-primary),0.1)]",
        icon: "text-[rgb(var(--spotlight-primary))]",
      },
      success: {
        wrapper: "bg-[rgba(var(--spotlight-success),0.1)]",
        icon: "text-[rgb(var(--spotlight-success))]",
      },
      danger: {
        wrapper: "bg-[rgba(var(--spotlight-danger),0.1)]",
        icon: "text-[rgb(var(--spotlight-danger))]",
      },
      info: {
        wrapper: "bg-[rgba(var(--spotlight-info),0.1)]",
        icon: "text-[rgb(var(--spotlight-info))]",
      },
      accent: {
        wrapper: "bg-[rgba(var(--spotlight-accent),0.1)]",
        icon: "text-[rgb(var(--spotlight-accent))]",
      },
      warning: {
        wrapper: "bg-[rgba(var(--spotlight-warning),0.1)]",
        icon: "text-[rgb(var(--spotlight-warning))]",
      },
    },
  },
});

const metricTrendStyles = tv({
  base: "flex items-center gap-1 text-xs",
  variants: {
    direction: {
      up: "text-[rgb(var(--spotlight-teal))]",
      down: "text-[rgb(var(--spotlight-danger))]",
    },
  },
});

function MetricHeader({
  label,
  icon: Icon,
  color,
}: {
  label: string;
  icon: LucideIcon;
  color: MetricColor;
}) {
  const { wrapper, icon } = metricIconStyles({ color });
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-(--text-muted)">{label}</span>
      <div className={wrapper()}>
        <Icon size={24} className={icon()} />
      </div>
    </div>
  );
}

function MetricValue({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[22px] font-semibold leading-none text-(--text-heading)",
        className
      )}
      {...props}
    />
  );
}

function MetricTrend({
  value,
  direction,
}: {
  value: string;
  direction: "up" | "down";
}) {
  const TrendIcon = direction === "up" ? TrendingUp : TrendingDown;
  return (
    <div className={metricTrendStyles({ direction })}>
      <TrendIcon size={13} />
      <span>{value}</span>
    </div>
  );
}

export const Card = { Root, Header, Content, Footer, MetricHeader, MetricValue, MetricTrend };
