import {
  BarChart2,
  CircleHelp,
  ChevronsUpDown,
  LayoutDashboard,
  Megaphone,
  Settings,
} from "lucide-react";
import { NavLink, useMatch } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/client/components/ui/avatar";
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
      { icon: LayoutDashboard, label: "Dashboard" },
      { icon: Megaphone, label: "Campanhas", path: "/my-campaigns" },
      { icon: BarChart2, label: "Relatórios" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { icon: Settings, label: "Configurações" },
      { icon: CircleHelp, label: "Ajuda" },
    ],
  },
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
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip={label}
          className="cursor-default opacity-60 rounded-xl"
        >
          <Icon size={18} />
          <span>{label}</span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

function UserProfile() {
  const { user } = useRoot();
  const initials = user ? getInitials(user.name) : "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default bg-sidebar-accent/50 hover:bg-sidebar-accent/70 rounded-lg"
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function PortalSidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between px-4 py-4">
        <img
          src={LIGHT_LOGO}
          alt="Logo"
          className="h-8 w-auto shrink-0 group-data-[collapsible=icon]:hidden"
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
