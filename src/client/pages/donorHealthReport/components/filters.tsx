import { useLocation, useNavigate } from "react-router";
import { Card } from "~/client/components/ui/card";
import { Label } from "~/client/components/ui/label";
import { Select } from "~/client/components/ui/select";

const PERIOD_OPTIONS = [12, 24, 36];
const LAPSE_OPTIONS = [3, 6, 9, 12];

type FiltersProps = {
  windowMonths: number;
  lapseMonths: number;
};

function Filters({ windowMonths, lapseMonths }: FiltersProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(param: "months" | "lapse_months", value: string) {
    const params = new URLSearchParams(location.search);
    params.set(param, value);
    navigate(`?${params.toString()}`, { preventScrollReset: true });
  }

  return (
    <Card.Root className="grid gap-4 p-6 md:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="donor-health-period">Período</Label>
        <Select.Root
          value={String(windowMonths)}
          onValueChange={(value) => handleChange("months", value)}
        >
          <Select.Trigger id="donor-health-period">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {PERIOD_OPTIONS.map((months) => (
              <Select.Item key={months} value={String(months)}>
                Últimos {months} meses
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="donor-health-lapse">Considerar lapso após</Label>
        <Select.Root
          value={String(lapseMonths)}
          onValueChange={(value) => handleChange("lapse_months", value)}
        >
          <Select.Trigger id="donor-health-lapse">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {LAPSE_OPTIONS.map((months) => (
              <Select.Item key={months} value={String(months)}>
                {months} meses sem doar
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    </Card.Root>
  );
}

export { Filters };
