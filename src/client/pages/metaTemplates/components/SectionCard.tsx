import { Card } from "~/client/components/ui/card";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card.Root className="gap-0 p-0">
      <div className="flex flex-col gap-1 p-7 pb-5">
        <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-7 pt-0">{children}</div>
    </Card.Root>
  );
}

export { SectionCard };
