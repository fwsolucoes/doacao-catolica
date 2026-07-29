import * as React from "react";

import { cn } from "~/client/lib/utils";
import { Label } from "./label";

type FieldErrors = Record<string, string[] | undefined>;

const FormErrorContext = React.createContext<FieldErrors>({});
const FormFieldContext = React.createContext<string>("");

function FormErrorProvider({
  fieldErrors,
  children,
}: {
  fieldErrors?: FieldErrors | null;
  children: React.ReactNode;
}) {
  return (
    <FormErrorContext value={fieldErrors ?? {}}>{children}</FormErrorContext>
  );
}

type FormFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

function FormField({
  name,
  label,
  required = false,
  optional = false,
  className,
  children,
}: FormFieldProps) {
  const fieldErrors = React.use(FormErrorContext);
  const error = fieldErrors[name];
  const hasError = !!error?.length;

  return (
    <FormFieldContext value={name}>
      <div
        data-invalid={hasError ? "" : undefined}
        className={cn("group flex flex-col gap-1.5", className)}
      >
        <Label htmlFor={name} className="inline-flex items-baseline gap-1.5">
          {required && <span className="text-destructive">*</span>}
          {label}
          {optional && <span className="text-xs font-normal text-muted-foreground">(opcional)</span>}
        </Label>

        {children}

        {hasError && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    </FormFieldContext>
  );
}

export { FormErrorProvider, FormField, FormErrorContext, FormFieldContext };
export type { FieldErrors };
