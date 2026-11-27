import type { ReactNode } from "react";
import { Card } from "~/client/components/ui/card";
import { cn } from "~/lib/utils";

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-0 p-0">
      <div
        className={cn(
          "grid items-start p-5 sm:p-7",
          action && "grid-cols-[1fr_auto] gap-x-4",
        )}
      >
        <h2 className="self-center text-base font-semibold text-foreground sm:self-start">
          {title}
        </h2>
        {action && (
          <div className="col-start-2 row-start-1 flex items-center sm:row-span-2">
            {action}
          </div>
        )}
        {description && (
          <p
            className={cn(
              "mt-1 text-sm text-muted-foreground",
              action && "col-span-2 sm:col-span-1",
            )}
          >
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-5 px-5 pb-5 sm:px-7 sm:pb-7">{children}</div>
    </Card.Root>
  );
}

export { SectionCard };
