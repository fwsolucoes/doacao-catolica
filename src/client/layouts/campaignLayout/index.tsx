import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "~/client/components/ui/sidebar";
import { CampaignBanner } from "./components/campaignBanner";
import { AppSidebar } from "./components/sidebar";

function CampaignLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <CampaignBanner />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { CampaignLayout };
