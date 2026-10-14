import { CircleUser, ChevronsUpDown, LogOut, Wallet } from "lucide-react";
import { useFetcher } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/client/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/client/components/ui/sidebar";

function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0].toUpperCase();
  const last =
    words.length > 1 ? words[words.length - 1][0].toUpperCase() : "";
  return first + last;
}

function SidebarUserMenu() {
  const { user, environmentVariables } = useRoot();
  const { isMobile } = useSidebar();
  const fetcher = useFetcher();
  const initials = user ? getInitials(user.name) : "";

  function toSanctonPanel(redirect: string) {
    return `${environmentVariables.SANCTON_CRM_PANEL_URL}/api/auth/token?token=${user?.token}&redirect=${redirect}`;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-auto gap-3.5 rounded-2xl bg-secondary/60 px-2.5 py-2.5 hover:bg-secondary/80 data-[state=open]:bg-secondary"
            >
              <Avatar className="size-11 group-data-[collapsible=icon]:size-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-sidebar-primary text-sm font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 gap-0.5 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-[13px] leading-4 font-semibold text-foreground">
                  {user?.name}
                </span>
                <span className="truncate text-[11px] leading-4 text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown
                size={14}
                className="ml-auto shrink-0 text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-[0.7rem] font-extrabold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                href={toSanctonPanel("/profile/settings")}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer"
              >
                <CircleUser size={16} />
                Minha conta
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={toSanctonPanel("/sub-accounts")}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer"
              >
                <Wallet size={16} />
                Carteira digital
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                fetcher.submit(null, {
                  method: "post",
                  action: "/api/logout-user",
                })
              }
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <LogOut size={16} />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { SidebarUserMenu };
