import { use, useState } from "react";
import CurrencyInputPrimitive from "react-currency-input-field";
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

  const [numericValue, setNumericValue] = useState(
    defaultValue?.toString() ?? "",
  );

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
      <CurrencyInputPrimitive
        id={resolvedId}
        intlConfig={{ locale: "pt-BR" }}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onValueChange={(_, __, values) => setNumericValue(values?.value ?? "")}
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
