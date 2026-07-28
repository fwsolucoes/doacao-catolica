import { Inbox } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Empty as EmptyComponent } from "./empty";
import { cn } from "~/lib/utils";

function Root({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="relative min-w-0 w-full overflow-x-auto rounded-(--radius)">
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
  return <thead className={cn("bg-secondary", className)} {...props} />;
}

function Body({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "before:content-[''] before:table-row before:h-3",
        "[&>tr]:h-16 [&>tr:nth-child(odd)]:bg-muted",
        "[&>tr:nth-child(n):hover]:bg-secondary",
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
        "h-11 px-4 text-left align-middle font-semibold text-sm text-muted-foreground whitespace-nowrap first:rounded-l-(--radius) last:rounded-r-(--radius)",
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
        "px-4 align-middle text-sm text-foreground whitespace-nowrap first:rounded-l-(--radius) last:rounded-r-(--radius)",
        className,
      )}
      {...props}
    />
  );
}

type TableEmptyProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

function Empty({
  title = "Nenhum registro encontrado.",
  description,
  icon = <Inbox />,
  className,
}: TableEmptyProps) {
  return (
    <Row>
      <Cell colSpan={9999}>
        <EmptyComponent.Root className={cn("border-0 py-12", className)}>
          <EmptyComponent.Media variant="icon">{icon}</EmptyComponent.Media>
          <EmptyComponent.Header>
            <EmptyComponent.Title>{title}</EmptyComponent.Title>
            {description && (
              <EmptyComponent.Description>{description}</EmptyComponent.Description>
            )}
          </EmptyComponent.Header>
        </EmptyComponent.Root>
      </Cell>
    </Row>
  );
}

export const Table = { Root, Header, Body, Row, Head, Cell, Empty };
