import { useState } from "react";
import {
  Check,
  Church,
  HandCoins,
  Repeat,
  Sparkles,
  Tag,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { cn } from "~/lib/utils";

// known values: lucide icon names in kebab-case, as returned by /select/project-categories
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  repeat: Repeat,
  church: Church,
  "hand-coins": HandCoins,
  target: Target,
  users: Users,
  sparkles: Sparkles,
};

type Category = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
};

function CategoryPicker({
  categories,
  defaultValue,
}: {
  categories: Category[];
  defaultValue?: string | null;
}) {
  const [selectedId, setSelectedId] = useState(defaultValue ?? "");

  return (
    <>
      <input type="hidden" name="category" value={selectedId} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {categories.map((category) => {
          const selected = selectedId === category.id;
          const Icon = (category.icon && CATEGORY_ICONS[category.icon]) || Tag;
          return (
            <Button
              key={category.id}
              type="button"
              variant="ghost"
              onClick={() => setSelectedId(category.id)}
              className={cn(
                "relative h-auto min-h-48 flex-col items-start justify-start gap-3.5 rounded-xl border p-5 text-left whitespace-normal transition-colors hover:brightness-100",
                selected
                  ? "border-primary bg-primary/5 hover:bg-primary/5"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-xl p-2.5",
                  selected ? "bg-primary" : "bg-muted",
                )}
              >
                <Icon
                  size={20}
                  className={
                    selected ? "text-primary-foreground" : "text-foreground"
                  }
                />
              </span>
              <div className="flex flex-col gap-1 pr-6">
                <span className="text-base font-semibold text-foreground">
                  {category.name}
                </span>
                {category.description && (
                  <span className="text-xs font-normal text-muted-foreground">
                    {category.description}
                  </span>
                )}
              </div>
              {selected && (
                <span className="absolute top-3.5 right-3.5 flex size-6 items-center justify-center rounded-full bg-primary">
                  <Check size={14} className="text-primary-foreground" />
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </>
  );
}

export { CategoryPicker };
