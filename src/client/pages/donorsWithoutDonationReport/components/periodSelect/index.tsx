import { Calendar } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Select } from "~/client/components/ui/select";

const PERIOD_OPTIONS = [
  { label: "Mês atual", value: "current_month" },
  { label: "Mês anterior", value: "last_month" },
  { label: "Últimos 7 dias", value: "last_7_days" },
  { label: "Últimos 30 dias", value: "last_30_days" },
  { label: "Últimos 90 dias", value: "last_90_days" },
  { label: "Ano atual", value: "current_year" },
] as const;

function PeriodSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const period = searchParams.get("period") ?? "current_month";

  function handleSelect(value: string) {
    const sp = new URLSearchParams(location.search);
    sp.set("period", value);
    sp.delete("page");
    navigate(`?${sp.toString()}`);
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

export { PeriodSelect };
