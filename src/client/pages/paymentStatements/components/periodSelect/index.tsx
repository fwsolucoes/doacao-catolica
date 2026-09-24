import { Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Select } from "~/client/components/ui/select";

export const PERIOD_OPTIONS = [
  { label: "Mês atual", value: "currentMonth" },
  { label: "Últimos 30 dias", value: "last30Days" },
  { label: "Últimos 60 dias", value: "last60Days" },
  { label: "Últimos 6 meses", value: "last6Months" },
  { label: "Últimos 12 meses", value: "last12Months" },
  { label: "Mês anterior", value: "lastMonth" },
  { label: "Mês seguinte", value: "nextMonth" },
  { label: "Próximos 12 meses", value: "next12Month" },
  { label: "Data personalizada", value: "custom" },
] as const;

function getDatesFromPeriod(period: string): { startDate: string; endDate: string } {
  const today = new Date();

  function monthRange(offset: number) {
    return {
      startDate: new Date(today.getFullYear(), today.getMonth() - offset, 1)
        .toISOString()
        .split("T")[0]!,
      endDate: new Date(today.getFullYear(), today.getMonth() - offset + 1, 0)
        .toISOString()
        .split("T")[0]!,
    };
  }

  function lastDaysRange(days: number) {
    const from = new Date(today);
    from.setDate(today.getDate() - days);
    return {
      startDate: from.toISOString().split("T")[0]!,
      endDate: today.toISOString().split("T")[0]!,
    };
  }

  switch (period) {
    case "last30Days":   return lastDaysRange(30);
    case "last60Days":   return lastDaysRange(60);
    case "last6Months":  return lastDaysRange(180);
    case "last12Months": return lastDaysRange(365);
    case "lastMonth":    return monthRange(1);
    case "nextMonth":    return monthRange(-1);
    case "next12Month":  return {
      startDate: today.toISOString().split("T")[0]!,
      endDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
        .toISOString()
        .split("T")[0]!,
    };
    default: return monthRange(0);
  }
}

type PeriodSelectProps = {
  onCustomSelect?: () => void;
};

function PeriodSelect({ onCustomSelect }: PeriodSelectProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const period = searchParams.get("period") ?? "currentMonth";

  function applyParams(updates: Record<string, string>) {
    const sp = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(updates)) {
      sp.set(key, value);
    }
    navigate(`?${sp.toString()}`);
  }

  function handleSelect(value: string) {
    if (value === "custom") {
      onCustomSelect?.();
      return;
    }
    const { startDate, endDate } = getDatesFromPeriod(value);
    applyParams({ start_date: startDate, end_date: endDate, period: value });
  }

  return (
    <Select.Root value={period} onValueChange={handleSelect}>
      <Select.Trigger className="w-auto rounded-xl bg-background px-4">
        <Calendar size={16} className="shrink-0 text-muted-foreground" />
        <Select.Value />
      </Select.Trigger>
      <Select.Content position="popper" align="end">
        {PERIOD_OPTIONS.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}

export { PeriodSelect, getDatesFromPeriod };
