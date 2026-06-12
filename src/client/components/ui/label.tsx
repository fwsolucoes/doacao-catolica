import * as React from "react";

import { cn } from "~/client/lib/utils";

function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none select-none text-(--foreground)",
        className
      )}
      {...props}
    />
  );
}

export { Label };
