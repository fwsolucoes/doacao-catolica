import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
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

type LinkProps = ComponentProps<"a"> & { isActive?: boolean };

function Link({ className, isActive, ...props }: LinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex size-7 items-center justify-center rounded text-sm font-semibold",
        isActive
          ? "bg-[rgb(var(--spotlight-primary))] text-white"
          : "text-(--text-muted) hover:bg-(--card-foreground-secondary)",
        className
      )}
      {...props}
    />
  );
}

function Previous({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      aria-label="Página anterior"
      className={cn(
        "flex size-7 items-center justify-center rounded text-(--text-muted) hover:bg-(--card-foreground-secondary)",
        className
      )}
      {...props}
    >
      <ChevronLeft size={16} />
    </a>
  );
}

function Next({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      aria-label="Próxima página"
      className={cn(
        "flex size-7 items-center justify-center rounded text-(--text-muted) hover:bg-(--card-foreground-secondary)",
        className
      )}
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
        "flex size-7 items-center justify-center text-(--text-muted)",
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
