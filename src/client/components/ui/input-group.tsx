import * as React from "react";

import { FormFieldContext } from "~/client/components/ui/form-field";
import { cn } from "~/client/lib/utils";

function InputGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-group"
      className={cn("relative isolate flex items-center", className)}
      {...props}
    />
  );
}

type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement> & {
  align: "inline-start" | "inline-end";
};

function InputGroupAddon({
  align,
  className,
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      data-slot="input-addon"
      data-align={align}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center text-(--muted-foreground)",
        align === "inline-start" ? "left-3" : "right-3",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  id,
  name,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const fieldName = React.use(FormFieldContext);
  const resolvedName = name ?? (fieldName || undefined);
  const resolvedId = id ?? (fieldName || undefined);

  return (
    <input
      data-slot="input-group-input"
      id={resolvedId}
      name={resolvedName}
      className={cn(
        "w-full min-h-11 rounded-md border border-(--border) bg-(--input) text-sm",
        "px-3 py-2 text-(--foreground)",
        "placeholder:text-(--muted-foreground)",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupInput };
