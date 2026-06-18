import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-16 rounded-md border border-border bg-input px-3 py-2 text-sm",
        "text-foreground placeholder:text-muted-foreground",
        "outline-none ring-offset-background",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
