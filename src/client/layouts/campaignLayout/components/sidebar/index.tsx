import { useState } from "react";
import {
  BarChart2,
  ChevronDown,
  ChevronsUpDown,
  CircleHelp,
  CircleUser,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { NavLink, useLocation, useMatch, useParams } from "react-router";
import { useFetcher } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import { cn } from "~/lib/utils";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "~/client/components/ui/sidebar";

type SubNavItem = {
  label: string;
  path?: string;
};

type NavItem = {
  icon: React.ElementType;
  label: string;
  path?: string;
  subItems?: SubNavItem[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "Campanha",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "home" },
      { icon: Heart, label: "Doações", path: "donations" },
      { icon: Users, label: "Doadores", path: "donors" },
      {
        icon: Wallet,
        label: "Financeiro",
        subItems: [
          { label: "Transferências", path: "transfers" },
          { label: "Métodos de pagamento", path: "payment-methods" },
          { label: "Pix Automático", path: "automatic-pix" },
        ],
      },
      { icon: BarChart2, label: "Relatórios", path: "reports" },
      {
        icon: MessageSquare,
        label: "Mensagens",
        subItems: [
          { label: "Régua de mensagens", path: "message-rules" },
          { label: "Templates META", path: "meta-templates" },
          { label: "Mensagens enviadas", path: "notifications" },
        ],
      },
      {
        icon: UserCog,
        label: "Usuários",
        subItems: [
          { label: "Colaboradores", path: "collaborators" },
          { label: "Embaixadores", path: "fundraisers" },
        ],
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      { icon: Settings, label: "Configurações", path: "settings/general-info" },
      // { icon: CircleHelp, label: "Ajuda" },
    ],
  },
];

function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0].toUpperCase();
  const last = words.length > 1 ? words[words.length - 1][0].toUpperCase() : "";
  return first + last;
}

function NavItemRow({
  icon: Icon,
  label,
  path,
  basePath,
}: {
  icon: React.ElementType;
  label: string;
  path?: string;
  basePath: string;
}) {
  const to = path ? `${basePath}/${path}` : null;
  const match = useMatch(to ?? "/__no_route__");
  const isActive = !!match && !!to;

  return (
    <SidebarMenuItem>
      {to ? (
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={label}
          className="rounded-xl"
        >
          <NavLink to={to} end>
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

function CollapsibleNavItem({
  icon: Icon,
  label,
  subItems,
  basePath,
}: {
  icon: React.ElementType;
  label: string;
  subItems: SubNavItem[];
  basePath: string;
}) {
  const { pathname } = useLocation();
  const hasActiveChild = subItems.some(
    (item) => item.path && pathname === `${basePath}/${item.path}`,
  );
  const [open, setOpen] = useState(hasActiveChild);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={hasActiveChild}
        tooltip={label}
        onClick={() => setOpen((o) => !o)}
        className="rounded-xl"
      >
        <Icon size={20} />
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "ml-auto shrink-0 transition-transform duration-200",
            open && "-rotate-180",
          )}
        />
      </SidebarMenuButton>
      {open && (
        <SidebarMenuSub>
          {subItems.map((item) => {
            const to = item.path ? `${basePath}/${item.path}` : null;
            const isActive = !!to && pathname === to;
            return (
              <SidebarMenuSubItem key={item.label}>
                {to ? (
                  <SidebarMenuSubButton asChild isActive={isActive}>
                    <NavLink to={to} end>
                      {item.label}
                    </NavLink>
                  </SidebarMenuSubButton>
                ) : (
                  <SidebarMenuSubButton className="cursor-default opacity-60">
                    {item.label}
                  </SidebarMenuSubButton>
                )}
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
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

function AppSidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;
  const { campaignId } = useParams<{ campaignId: string }>();
  const basePath = `/campaign/${campaignId}`;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between px-4 py-6">
        <img
          src={LIGHT_LOGO}
          alt="Logo"
          className="h-10 w-auto shrink-0 group-data-[collapsible=icon]:hidden"
        />
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) =>
                item.subItems ? (
                  <CollapsibleNavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    subItems={item.subItems}
                    basePath={basePath}
                  />
                ) : (
                  <NavItemRow
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    basePath={basePath}
                  />
                ),
              )}
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

export { AppSidebar };
