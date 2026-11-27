type LegendItem = {
  label: string;
  color: string;
  dashed?: boolean;
};

function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2.5 text-sm text-foreground">
          <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden="true">
            <line
              x1="1"
              y1="4"
              x2="19"
              y2="4"
              stroke={item.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={item.dashed ? "3 3" : undefined}
            />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export { ChartLegend };
export type { LegendItem };
