import { use, type ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { FormErrorContext, FormFieldContext } from "./form-field";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  const name = use(FormFieldContext);
  const fieldErrors = use(FormErrorContext);
  const hasError = !!fieldErrors[name]?.length;

  return (
    <textarea
      data-slot="textarea"
      aria-invalid={hasError || undefined}
      className={cn(
        "w-full min-h-16 rounded-md border border-border bg-input px-3 py-2 text-sm",
        "text-foreground placeholder:text-muted-foreground",
        "outline-none ring-offset-background",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "group-data-invalid:border-destructive group-data-invalid:focus-visible:ring-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
