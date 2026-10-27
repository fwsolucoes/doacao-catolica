import { CircleHelp } from "lucide-react";
import { NavLink, useMatch } from "react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/client/components/ui/sidebar";

function SidebarHelpLink({ to }: { to: string }) {
  const isActive = !!useMatch(to);

  return (
    <SidebarGroup className="border-t border-sidebar-border/50">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive}
            tooltip="Ajuda"
            size="lg"
            className="rounded-xl hover:bg-accent data-[active=true]:bg-accent"
          >
            <NavLink to={to} end>
              <CircleHelp size={20} />
              <span className="group-data-[collapsible=icon]:hidden">Ajuda</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { SidebarHelpLink };
