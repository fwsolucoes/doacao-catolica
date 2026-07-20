import type { ComponentProps } from "react";
import { use } from "react";
import { FormFieldContext } from "~/client/components/ui/form-field";
import { cn } from "~/lib/utils";

function Root({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "relative isolate flex items-stretch ring-offset-background",
        // Side mode: shared border + rounding on Root
        "[&:has([data-slot='input-side'])]:overflow-hidden",
        "[&:has([data-slot='input-side'])]:rounded-md",
        "[&:has([data-slot='input-side'])]:border",
        "[&:has([data-slot='input-side'])]:border-border",
        // Side mode: strip Input's own border/rounding (ring removed via className on Input)
        "[&:has([data-slot='input-side'])_[data-slot='input-group-input']]:border-0",
        "[&:has([data-slot='input-side'])_[data-slot='input-group-input']]:rounded-none",
        "[&:has([data-slot='input-side'])_[data-slot='input-group-input']]:shadow-none",
        // Side mode: ring on Root itself when its Input is focused
        // (chained :has() — no "_" — targets Root, not a descendant)
        "[&:has([data-slot='input-side']):has([data-slot='input-group-input']:focus-visible)]:ring-2",
        "[&:has([data-slot='input-side']):has([data-slot='input-group-input']:focus-visible)]:ring-ring",
        "[&:has([data-slot='input-side']):has([data-slot='input-group-input']:focus-visible)]:ring-offset-1",
        className,
      )}
      {...props}
    />
  );
}

type AddonProps = ComponentProps<"div"> & {
  align?: "inline-start" | "inline-end";
};

function Addon({ align = "inline-start", className, ...props }: AddonProps) {
  return (
    <div
      data-slot="input-addon"
      data-align={align}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center text-muted-foreground",
        align === "inline-start" ? "left-3" : "right-3",
        className,
      )}
      {...props}
    />
  );
}

type SideProps = ComponentProps<"span"> & {
  side?: "start" | "end";
};

function Side({ side = "start", className, ...props }: SideProps) {
  return (
    <span
      data-slot="input-side"
      data-side={side}
      className={cn(
        "inline-flex shrink-0 items-center select-none bg-muted/50 px-3 text-sm text-muted-foreground",
        side === "start" ? "border-r border-border" : "border-l border-border",
        className,
      )}
      {...props}
    />
  );
}

function Text({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn("text-sm select-none", className)}
      {...props}
    />
  );
}

function Input({ className, id, name, ...props }: ComponentProps<"input">) {
  const fieldName = use(FormFieldContext);
  const resolvedName = name ?? (fieldName || undefined);
  const resolvedId = id ?? (fieldName || undefined);

  return (
    <input
      data-slot="input-group-input"
      id={resolvedId}
      name={resolvedName}
      className={cn(
        "w-full min-h-11 rounded-md border border-border bg-input text-sm",
        "px-3 py-2 text-foreground",
        "placeholder:text-muted-foreground",
        "outline-none ring-offset-background",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export const InputGroup = { Root, Addon, Input, Text, Side };
