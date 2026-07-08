import { use, useState } from "react";
import { FormFieldContext } from "~/client/components/ui/form-field";
import { cn } from "~/lib/utils";

type CurrencyInputProps = {
  name?: string;
  id?: string;
  defaultValue?: number;
  placeholder?: string;
  min?: number;
  disabled?: boolean;
  className?: string;
};

function digitsToDisplay(digits: string): string {
  if (!digits) return "";
  const padded = digits.padStart(3, "0");
  const intPart = padded.slice(0, -2).replace(/^0+/, "") || "0";
  const decPart = padded.slice(-2);
  const intFormatted = Number(intPart).toLocaleString("pt-BR");
  return `${intFormatted},${decPart}`;
}

function CurrencyInput({
  name,
  id,
  defaultValue,
  placeholder = "0,00",
  min,
  disabled,
  className,
}: CurrencyInputProps) {
  const fieldName = use(FormFieldContext);
  const resolvedName = name ?? (fieldName || undefined);
  const resolvedId = id ?? (fieldName || undefined);

  const [rawDigits, setRawDigits] = useState(() =>
    defaultValue !== undefined
      ? String(Math.round(defaultValue * 100))
      : "",
  );

  const displayValue = digitsToDisplay(rawDigits);
  const numericValue = rawDigits ? (parseInt(rawDigits, 10) / 100).toString() : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    setRawDigits(digits);
  }

  return (
    <div
      className={cn(
        "flex rounded-md border border-border bg-input",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 ring-offset-background",
        "has-disabled:opacity-50",
      )}
    >
      <span className="flex items-center px-3 bg-muted border-r border-border rounded-l-md select-none text-sm text-muted-foreground font-mono">
        R$
      </span>
      <input type="hidden" name={resolvedName} value={numericValue} />
      <input
        id={resolvedId}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex-1 min-h-11 bg-transparent text-sm",
          "px-3 py-2 text-foreground",
          "placeholder:text-muted-foreground",
          "outline-none",
          "disabled:cursor-not-allowed",
          className,
        )}
      />
    </div>
  );
}

export { CurrencyInput };
