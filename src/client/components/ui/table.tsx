import { cn } from "~/lib/utils";
import type { ComponentProps } from "react";

function Root({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto rounded-md">
      <table
        className={cn(
          "w-full border-separate border-spacing-0 text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function Header({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn("bg-(--card-foreground-secondary)", className)}
      {...props}
    />
  );
}

function Body({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "before:content-[''] before:table-row before:h-3",
        "[&>tr]:h-16 [&>tr:nth-child(odd)]:bg-(--card-foreground-primary)",
        "[&>tr:nth-child(n):hover]:bg-(--card-foreground-secondary)",
        className,
      )}
      {...props}
    />
  );
}

function Row({ className, ...props }: ComponentProps<"tr">) {
  return <tr className={cn("transition-colors", className)} {...props} />;
}

function Head({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-11 px-4 text-left align-middle font-semibold text-sm text-(--text-heading) whitespace-nowrap first:rounded-l-md last:rounded-r-md",
        className,
      )}
      {...props}
    />
  );
}

function Cell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-4 align-middle text-sm text-(--text-body) whitespace-nowrap first:rounded-l-md last:rounded-r-md",
        className,
      )}
      {...props}
    />
  );
}

export const Table = { Root, Header, Body, Row, Head, Cell };
