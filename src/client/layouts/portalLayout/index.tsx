import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "~/client/components/ui/sidebar";
import { PortalHeader } from "./components/header";
import { PortalSidebar } from "./components/sidebar";

function PortalLayout() {
  return (
    <SidebarProvider>
      <PortalSidebar />
      <SidebarInset>
        <PortalHeader />
        <main className="p-6 sm:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { PortalLayout };
