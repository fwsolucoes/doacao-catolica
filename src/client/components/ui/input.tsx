import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "~/client/lib/utils";
import { FormErrorContext, FormFieldContext } from "./form-field";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: LucideIcon;
};

function Input({ leftIcon: LeftIcon, className, ...props }: InputProps) {
  const name = React.use(FormFieldContext);
  const fieldErrors = React.use(FormErrorContext);
  const hasError = !!fieldErrors[name]?.length;

  return (
    <div className="relative flex items-center">
      {LeftIcon && (
        <span className="absolute left-3 pointer-events-none flex items-center">
          <LeftIcon size={16} className="text--muted-foreground" />
        </span>
      )}
      <input
        aria-invalid={hasError || undefined}
        className={cn(
          "w-full min-h-11 rounded-md border border-border bg-input text-sm",
          "px-3 py-2 text-foreground)",
          "placeholder:text-muted-foreground",
          "outline-none ring-offset-background",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "group-data-invalid:border-destructive group-data-invalid:focus-visible:ring-destructive",
          "disabled:cursor-not-allowed disabled:opacity-50",
          LeftIcon && "pl-9",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
export type { InputProps };
