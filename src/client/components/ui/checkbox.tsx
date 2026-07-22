import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-5 shrink-0 rounded-[4px] border border-sidebar-primary bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-sidebar-primary data-[state=unchecked]:bg-background",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <Check size={12} strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
