import type { ReactNode } from "react";
import { Card } from "~/client/components/ui/card";

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-0 p-0">
      <div className="flex items-start justify-between gap-4 p-7">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      <div className="flex flex-col gap-5 px-7 pb-7">{children}</div>
    </Card.Root>
  );
}

export { SectionCard };
