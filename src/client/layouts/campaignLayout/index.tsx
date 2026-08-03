import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "~/client/components/ui/sidebar";
import { CampaignLayoutProvider } from "~/client/hooks/useCampaignLayout";
import { CampaignBanner } from "./components/campaignBanner";
import { AppSidebar } from "./components/sidebar";

function CampaignLayout() {
  return (
    <CampaignLayoutProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <CampaignBanner />
          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </CampaignLayoutProvider>
  );
}

export { CampaignLayout };
