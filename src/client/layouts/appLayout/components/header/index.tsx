import {
  Bell,
  ChevronDown,
  LayoutGrid,
  LifeBuoy,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { useRoot } from "~/client/hooks/useRoot";
import { useTheme } from "~/client/hooks/useTheme";

const iconButtonClass = "bg-(--card-foreground-secondary)";

function Header() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;
  const { theme, toggle } = useTheme();

  return (
    <header className="fixed w-full flex h-16 items-center justify-between border-b border-(--border) bg-(--card) px-8">
      <div className="flex w-64 shrink-0 items-center gap-6 pr-4">
        <img src={LIGHT_LOGO} alt="Sancton" className="h-8 w-auto shrink-0" />
        <span className="h-5 flex-1 min-w-px" aria-hidden="true" />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex h-8 items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Apps"
            className={iconButtonClass}
          >
            <LayoutGrid size={18} className="stroke-(--text-heading)" />
          </Button>
        </div>

        <Button
          size="icon"
          variant="ghost"
          aria-label="Alternar tema"
          onClick={toggle}
          className={iconButtonClass}
        >
          {theme === "light" ? (
            <Moon
              key="moon"
              size={18}
              className="animate-theme-icon-in stroke-(--text-heading)"
            />
          ) : (
            <Sun
              key="sun"
              size={18}
              className="animate-theme-icon-in stroke-(--text-heading)"
            />
          )}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          aria-label="Configurações"
          className={iconButtonClass}
        >
          <Settings size={18} className="stroke-(--text-heading)" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="size-11 shrink-0 rounded-full bg-linear-to-br from-indigo-400 to-violet-500" />
          <ChevronDown size={16} className="text-(--text-body)" />
        </div>
      </div>
    </header>
  );
}

export { Header };
