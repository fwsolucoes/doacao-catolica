import { useLocation, useNavigate } from "react-router";
import { Select } from "~/client/components/ui/select";

const PERIOD_OPTIONS = [
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

function PeriodSelect() {
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

  function applyMonthFilter(offset: number, periodKey: string) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - offset, 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() - offset + 1, 0)
      .toISOString()
      .split("T")[0];
    applyParams({ start_date: firstDay, end_date: lastDay, period: periodKey });
  }

  function applyLastDaysFilter(days: number, periodKey: string) {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - days);
    applyParams({
      start_date: from.toISOString().split("T")[0],
      end_date: today.toISOString().split("T")[0],
      period: periodKey,
    });
  }

  function applyYearFilter(yearOffset: number, periodKey: string) {
    const today = new Date();
    const endDate = new Date(
      today.getFullYear() + yearOffset,
      today.getMonth(),
      today.getDate(),
    )
      .toISOString()
      .split("T")[0];
    applyParams({
      start_date: today.toISOString().split("T")[0],
      end_date: endDate,
      period: periodKey,
    });
  }

  function handleSelect(value: string) {
    switch (value) {
      case "currentMonth":
        applyMonthFilter(0, value);
        break;
      case "last30Days":
        applyLastDaysFilter(30, value);
        break;
      case "last60Days":
        applyLastDaysFilter(60, value);
        break;
      case "last6Months":
        applyLastDaysFilter(180, value);
        break;
      case "last12Months":
        applyLastDaysFilter(365, value);
        break;
      case "lastMonth":
        applyMonthFilter(1, value);
        break;
      case "nextMonth":
        applyMonthFilter(-1, value);
        break;
      case "next12Month":
        applyYearFilter(1, value);
        break;
      case "custom":
        // TODO: abrir drawer de data personalizada
        break;
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-(--text-muted) whitespace-nowrap">
        Período:
      </span>
      <Select.Root value={period} onValueChange={handleSelect}>
        <Select.Trigger className="w-52 min-h-9">
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
    </div>
  );
}

export { PeriodSelect };
