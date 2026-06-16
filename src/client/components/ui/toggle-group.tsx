import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { tv } from "tailwind-variants";
import { cn } from "~/lib/utils";

const toggleGroupItem = tv({
  base: [
    "h-9 rounded-md border px-4 text-sm font-medium transition-colors cursor-pointer",
    "data-[state=off]:border-(--border) data-[state=off]:bg-(--card) data-[state=off]:text-(--foreground) data-[state=off]:hover:bg-(--accent)",
    "data-[state=on]:border-(--primary) data-[state=on]:bg-(--primary) data-[state=on]:text-white",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
});

type RootProps = {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function Root({ name, value, onValueChange, disabled, children, className }: RootProps) {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={value ?? ""}
      onValueChange={(v) => { if (v) onValueChange?.(v); }}
      disabled={disabled}
      className={cn("flex gap-2", className)}
    >
      {name && <input type="hidden" name={name} value={value ?? ""} />}
      {children}
    </ToggleGroupPrimitive.Root>
  );
}

type ItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item>;

function Item({ className, ...props }: ItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      className={toggleGroupItem({ className })}
      {...props}
    />
  );
}

export const ToggleGroup = { Root, Item };
