import type { ReactNode } from "react";
import { Card } from "~/client/components/ui/card";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card.Root className="flex flex-col gap-0 p-0">
      <div className="p-7">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-5 px-7 pb-7">{children}</div>
    </Card.Root>
  );
}

export { SectionCard };
