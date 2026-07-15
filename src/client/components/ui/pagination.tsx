import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Link as RouterLink } from "react-router";
import { cn } from "~/lib/utils";
import type { ComponentProps } from "react";

function Root({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="Paginação"
      className={className}
      {...props}
    />
  );
}

function Content({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul className={cn("flex items-center gap-1", className)} {...props} />
  );
}

function Item({ ...props }: ComponentProps<"li">) {
  return <li {...props} />;
}

type LinkProps = ComponentProps<"a"> & { isActive?: boolean; to?: string };

function Link({ className, isActive, to, ...props }: LinkProps) {
  const cls = cn(
    "flex size-7 items-center justify-center rounded-lg text-sm font-semibold",
    isActive
      ? "bg-(--primary) text-(--primary-foreground)"
      : "text-(--muted-foreground) hover:bg-(--muted)",
    className,
  );

  if (to !== undefined) {
    return (
      <RouterLink
        to={to}
        preventScrollReset
        aria-current={isActive ? "page" : undefined}
        className={cls}
        {...(props as any)}
      />
    );
  }

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cls}
      {...props}
    />
  );
}

type NavProps = ComponentProps<"a"> & { to?: string; disabled?: boolean };

function Previous({ className, to, disabled, ...props }: NavProps) {
  const cls = cn(
    "flex size-7 items-center justify-center rounded-lg text-(--muted-foreground) hover:bg-(--muted)",
    disabled && "pointer-events-none opacity-40",
    className,
  );

  if (to !== undefined) {
    return (
      <RouterLink
        to={to}
        preventScrollReset
        aria-label="Página anterior"
        aria-disabled={disabled}
        className={cls}
        {...(props as any)}
      >
        <ChevronLeft size={16} />
      </RouterLink>
    );
  }

  return (
    <a
      aria-label="Página anterior"
      aria-disabled={disabled}
      className={cls}
      {...props}
    >
      <ChevronLeft size={16} />
    </a>
  );
}

function Next({ className, to, disabled, ...props }: NavProps) {
  const cls = cn(
    "flex size-7 items-center justify-center rounded-lg text-(--muted-foreground) hover:bg-(--muted)",
    disabled && "pointer-events-none opacity-40",
    className,
  );

  if (to !== undefined) {
    return (
      <RouterLink
        to={to}
        preventScrollReset
        aria-label="Próxima página"
        aria-disabled={disabled}
        className={cls}
        {...(props as any)}
      >
        <ChevronRight size={16} />
      </RouterLink>
    );
  }

  return (
    <a
      aria-label="Próxima página"
      aria-disabled={disabled}
      className={cls}
      {...props}
    >
      <ChevronRight size={16} />
    </a>
  );
}

function Ellipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-7 items-center justify-center text-(--muted-foreground)",
        className
      )}
      {...props}
    >
      <MoreHorizontal size={16} />
      <span className="sr-only">Mais páginas</span>
    </span>
  );
}

export const Pagination = { Root, Content, Item, Link, Previous, Next, Ellipsis };
