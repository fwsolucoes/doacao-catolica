import { Bell, LayoutGrid, Moon, Search, Sun } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import { Input } from "~/client/components/ui/input";
import { SidebarTrigger } from "~/client/components/ui/sidebar";
import { useTheme } from "~/client/hooks/useTheme";

function PortalHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-6">
      <SidebarTrigger className="size-9 shrink-0" />

      <div className="h-7 w-px bg-border shrink-0" aria-hidden="true" />

      <div className="relative max-w-md flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          className="h-10 rounded-xl bg-muted/50 pl-9"
          placeholder="Buscar doadores, campanhas..."
          readOnly
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggle}
          className="size-9"
          aria-label="Alternar tema"
        >
          {theme === "light" ? (
            <Moon key="moon" size={18} className="animate-theme-icon-in" />
          ) : (
            <Sun key="sun" size={18} className="animate-theme-icon-in" />
          )}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="relative size-9"
          aria-label="Notificações"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-sidebar-primary" />
        </Button>

        <Button variant="outline" className="gap-2 rounded-xl">
          <LayoutGrid size={18} />
          Aplicações
        </Button>
      </div>
    </header>
  );
}

export { PortalHeader };
