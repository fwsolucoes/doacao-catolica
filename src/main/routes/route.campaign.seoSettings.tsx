import { CampaignSeoSettingsPage } from "~/client/pages/campaignSeoSettings";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignSeoSettingsRoute() {
  return <CampaignSeoSettingsPage />;
}
