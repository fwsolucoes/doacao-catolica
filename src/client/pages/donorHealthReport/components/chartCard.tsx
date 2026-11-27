import type { ReactNode } from "react";
import { Card } from "~/client/components/ui/card";
import { cn } from "~/lib/utils";
import { ChartLegend, type LegendItem } from "./chartLegend";

type ChartCardProps = {
  title: string;
  description: string;
  legend: LegendItem[];
  /** descrição textual do gráfico para leitores de tela */
  ariaLabel: string;
  className?: string;
  chartClassName?: string;
  children: ReactNode;
};

function ChartCard({
  title,
  description,
  legend,
  ariaLabel,
  className,
  chartClassName,
  children,
}: ChartCardProps) {
  return (
    <Card.Root className={cn("gap-5 p-6", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-(--text-heading)">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChartLegend items={legend} />
      <div
        role="img"
        aria-label={`${ariaLabel} Dados disponíveis na tabela mensal.`}
        className={cn("h-80", chartClassName)}
      >
        {children}
      </div>
    </Card.Root>
  );
}

export { ChartCard };
