import { type ReactNode, type ComponentProps } from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "~/lib/utils";

const toggleGroupItem = tv({
  base: [
    "rounded-md transition-colors cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    variant: {
      default: [
        "h-9 px-4 text-sm font-medium border",
        "data-[state=off]:border-(--border) data-[state=off]:bg-(--card) data-[state=off]:text-(--foreground) data-[state=off]:hover:bg-(--accent)",
        "data-[state=on]:border-(--primary) data-[state=on]:bg-(--primary) data-[state=on]:text-white",
      ],
      icon: [
        "size-8 flex items-center justify-center rounded-lg",
        "data-[state=off]:bg-transparent data-[state=off]:hover:bg-accent data-[state=off]:text-foreground",
        "data-[state=on]:bg-foreground/15 data-[state=on]:text-foreground",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type SingleRootProps = {
  type?: "single";
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

type MultipleRootProps = {
  type: "multiple";
  value?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

function Root(props: SingleRootProps | MultipleRootProps) {
  if (props.type === "multiple") {
    return (
      <ToggleGroupPrimitive.Root
        type="multiple"
        value={props.value ?? []}
        onValueChange={props.onValueChange}
        disabled={props.disabled}
        className={cn("flex gap-2", props.className)}
      >
        {props.children}
      </ToggleGroupPrimitive.Root>
    );
  }

  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={props.value ?? ""}
      onValueChange={(v) => { if (v) props.onValueChange?.(v); }}
      disabled={props.disabled}
      className={cn("flex gap-2", props.className)}
    >
      {props.name && <input type="hidden" name={props.name} value={props.value ?? ""} />}
      {props.children}
    </ToggleGroupPrimitive.Root>
  );
}

type ItemProps = ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleGroupItem>;

function Item({ className, variant, ...props }: ItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      className={toggleGroupItem({ variant, className })}
      {...props}
    />
  );
}

export const ToggleGroup = { Root, Item };
