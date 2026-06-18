import { Label } from "~/client/components/ui/label";
import { Switch } from "~/client/components/ui/switch";
import { cn } from "~/lib/utils";

type SwitchFieldProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

function SwitchField({ name, label, checked, onChange, disabled }: SwitchFieldProps) {
  return (
    <div className={cn("flex items-center gap-4", disabled && "opacity-50")}>
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <Label
        className={cn("cursor-pointer", disabled && "cursor-not-allowed")}
        onClick={() => !disabled && onChange(!checked)}
      >
        {label}
      </Label>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

export { SwitchField };
