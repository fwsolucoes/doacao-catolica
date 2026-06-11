import { Outlet } from "react-router";
import { CampaignBanner } from "./components/campaignBanner";
import { Sidebar } from "./components/sidebar";

function CampaignLayout() {
  return (
    <div>
      <Sidebar />
      <CampaignBanner />
      <main className="ml-68 mt-14 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export { CampaignLayout };
