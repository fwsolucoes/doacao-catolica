import { Slot } from "@radix-ui/react-slot";
import { tv, type VariantProps } from "tailwind-variants";
import type { ComponentProps } from "react";

const button = tv({
  base: [
    "inline-flex items-center justify-center gap-2",
    "font-semibold text-sm",
    "transition-[filter] duration-150",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "cursor-pointer",
  ],
  variants: {
    variant: {
      default: "bg-(--primary) text-(--primary-foreground) hover:brightness-95",
      secondary: "bg-(--secondary) text-(--primary) hover:brightness-95",
      outline:
        "border border-(--border) bg-transparent text-(--primary) hover:brightness-95",
      ghost: "bg-transparent text-(--primary) hover:brightness-95",
      danger:
        "bg-(--destructive) text-(--destructive-foreground) hover:brightness-95",
    },
    size: {
      default: "rounded-md min-h-11 px-4 py-2 w-full",
      icon: "size-8 rounded-full p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = ComponentProps<"button"> &
  ButtonVariants & {
    asChild?: boolean;
    isLoading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      disabled={isLoading || disabled}
      className={button({ variant, size, className })}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
    </Comp>
  );
}
