import { BarChart2, LayoutDashboard, Megaphone } from "lucide-react";
import { useRoot } from "~/client/hooks/useRoot";
import { SidebarUserMenu } from "~/client/components/sidebarUserMenu";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
} from "~/client/components/ui/sidebar";
import {
  SidebarNav,
  type SidebarNavSection,
} from "~/client/components/ui/sidebar-nav";

const sections: SidebarNavSection[] = [
  {
    title: "Principal",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Megaphone, label: "Campanhas", path: "/my-campaigns" },
      { icon: BarChart2, label: "Relatórios", path: "/reports" },
    ],
  },
];

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

      <SidebarNav sections={sections} />

      <SidebarFooter className="border-t border-sidebar-border/50 pb-3">
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

export { PortalSidebar };
