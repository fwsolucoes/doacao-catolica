import { ChevronsUpDown } from "lucide-react";
import {
  BarChart,
  BarChart2,
  Bell,
  Calendar,
  FileCheck,
  FileText,
  Heart,
  LayoutDashboard,
  Megaphone,
  Plug,
  Receipt,
  ScrollText,
  Settings,
  UserCheck,
  Users,
  Users2,
} from "lucide-react";
import { NavLink, useMatch, useParams } from "react-router";
import { useRoot } from "~/client/hooks/useRoot";
import { cn } from "~/lib/utils";
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
  SidebarTrigger,
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
    title: "",
    items: [{ icon: LayoutDashboard, label: "Dashboard", path: "home" }],
  },
  {
    title: "GESTÃO",
    items: [
      { icon: Heart, label: "Doações" },
      { icon: Megaphone, label: "Campanhas" },
      { icon: Bell, label: "Notificações enviadas", path: "notifications" },
      { icon: UserCheck, label: "Doadores" },
      { icon: Calendar, label: "Eventos" },
      { icon: Users, label: "Voluntários" },
    ],
  },
  {
    title: "FINANCEIRO",
    items: [
      { icon: Receipt, label: "Repasses" },
      { icon: FileText, label: "Despesas" },
      { icon: FileCheck, label: "Prestação de contas" },
    ],
  },
  {
    title: "RELATÓRIOS",
    items: [
      { icon: BarChart, label: "Relatório mensal" },
      { icon: BarChart2, label: "Relatório anual" },
      { icon: ScrollText, label: "Recibos" },
    ],
  },
  {
    title: "CONFIGURAÇÕES",
    items: [
      { icon: Settings, label: "Geral" },
      { icon: Users2, label: "Equipe" },
      { icon: Plug, label: "Integrações" },
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function NavItemRow({
  icon: Icon,
  label,
  path,
  basePath,
}: NavItem & { basePath: string }) {
  const to = path ? `${basePath}/${path}` : null;
  const match = useMatch(to ?? "/__no_route__");
  const isActive = !!match && !!to;

  return (
    <SidebarMenuItem className="relative">
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-7.5 w-1 rounded-r shrink-0",
          isActive ? "bg-sidebar-primary" : "bg-transparent",
        )}
      />
      {to ? (
        <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
          <NavLink to={to} end>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton tooltip={label} className="cursor-default opacity-60">
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
        <SidebarMenuButton size="lg" className="cursor-default">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-[0.7rem] font-extrabold text-sidebar">
            {initials}
          </div>
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

function AppSidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;
  const { campaignId } = useParams<{ campaignId: string }>();
  const basePath = `/campaign/${campaignId}`;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between px-4 py-4">
        <img
          src={LIGHT_LOGO}
          alt="Logo"
          className="h-8 w-auto shrink-0 group-data-[collapsible=icon]:hidden"
        />
        <SidebarTrigger className="text-sidebar-foreground/60 hover:bg-transparent hover:text-sidebar-foreground" />
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title || "__root__"}>
            {section.title ? (
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/60">
                {section.title}
              </SidebarGroupLabel>
            ) : null}
            <SidebarMenu>
              {section.items.map((item) => (
                <NavItemRow key={item.label} {...item} basePath={basePath} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/30 pb-3">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar };
