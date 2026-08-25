import {
  // BarChart2,
  // CircleHelp,
  CircleUser,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Wallet,
  // Settings,
} from "lucide-react";
import { NavLink, useMatch } from "react-router";
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/client/components/ui/sidebar";

type NavItem = {
  icon: React.ElementType;
  label: string;
  path?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "Principal",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Megaphone, label: "Campanhas", path: "/my-campaigns" },
      // { icon: BarChart2, label: "Relatórios" },
    ],
  },
  // {
  //   title: "Sistema",
  //   items: [
  //     { icon: Settings, label: "Configurações" },
  //     { icon: CircleHelp, label: "Ajuda" },
  //   ],
  // },
];

function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0].toUpperCase();
  const last =
    words.length > 1 ? words[words.length - 1][0].toUpperCase() : "";
  return first + last;
}

function NavItemRow({ icon: Icon, label, path }: NavItem) {
  const match = useMatch(path ?? "/__no_route__");
  const isActive = !!match && !!path;

  return (
    <SidebarMenuItem>
      {path ? (
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={label}
          className="rounded-xl"
        >
          <NavLink to={path} end>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip={label}
          className="cursor-default opacity-60 rounded-xl"
        >
          <Icon size={20} />
          <span>{label}</span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

function UserProfile() {
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
              className="bg-sidebar-accent/50 hover:bg-sidebar-accent/70 rounded-lg data-[state=open]:bg-sidebar-accent"
            >
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-sidebar-primary text-[0.7rem] font-extrabold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-sidebar-foreground">
                  {user?.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown
                size={14}
                className="ml-auto shrink-0 text-sidebar-foreground/40"
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

function PortalSidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between px-4 py-6">
        <img
          src={LIGHT_LOGO}
          alt="Logo"
          className="h-10 w-auto shrink-0 group-data-[collapsible=icon]:hidden"
        />
        <img
          src="/small-logo-icon.svg"
          alt="Logo"
          className="h-8 w-auto shrink-0 hidden group-data-[collapsible=icon]:block"
        />
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <NavItemRow key={item.label} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 pb-3">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}

export { PortalSidebar };
