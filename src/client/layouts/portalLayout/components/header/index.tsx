import { Bell, CalendarClock, HeartHandshake, LayoutGrid, Moon, Search, Sun } from "lucide-react";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Input } from "~/client/components/ui/input";
import { SidebarTrigger } from "~/client/components/ui/sidebar";
import { useTheme } from "~/client/hooks/useTheme";

function PortalHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-6">
      <SidebarTrigger className="size-9 shrink-0 text-foreground" />

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
            <Moon
              key="moon"
              size={18}
              className="animate-theme-icon-in text-foreground"
            />
          ) : (
            <Sun
              key="sun"
              size={18}
              className="animate-theme-icon-in text-foreground"
            />
          )}
        </Button>

        {/* <Button
          size="icon"
          variant="ghost"
          className="relative size-9 text-foreground"
          aria-label="Notificações"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-sidebar-primary" />
        </Button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 rounded-xl text-foreground">
              <LayoutGrid size={18} />
              Aplicações
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 p-3">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Aplicações
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-3 rounded-lg p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <CalendarClock size={20} className="text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Agenda Católica</span>
                <span className="text-xs text-muted-foreground">Gestão de Eventos e Inscrições</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 rounded-lg p-3 mt-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <HeartHandshake size={20} className="text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Doação Católica</span>
                <span className="text-xs text-muted-foreground">Gestão de campanhas e doações</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export { PortalHeader };
